'use client';

import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { json } from '@codemirror/lang-json';
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { buildRestfulApiUrl } from '@/utils/utils';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import * as Yup from 'yup';
import HttpMethodSelector from '@/components/FormControls/HttpMethodSelector';
import { HttpMethod } from '@/types/routesTypes';
import { schema } from '@/utils/validations/RestfulApiSchema';
import { useTranslation } from './i18n/client';
import {
  getRequestById,
  RequestHistoryItem,
  saveRequestToLocalStorage,
} from '@/utils/localStorageHelpers';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'next/navigation';
import ButtonBase from './Button';

const RestfulApiPlayground = () => {
  const { t } = useTranslation();
  const [endpoint, setEndpoint] = useState<string>('');
  const [method, setMethod] = useState<HttpMethod>(HttpMethod.GET);
  const [body, setBody] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [variables, setVariables] = useState<string>('{}');
  const [validationErrors, setValidationErrors] = useState({});
  const editorRef = useRef(null);
  const searchParams = useSearchParams();

  const validate = async () => {
    try {
      await schema(t).validate(
        {
          endpoint,
          method,
          body,
          variables,
          headers,
        },
        { abortEarly: false },
      );
      setValidationErrors({});
      return true;
    } catch (err) {
      console.log(err);
      if (err instanceof Yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const replacePlaceholdersWithVariables = (
    template: string,
    variables: Record<string, string>,
  ) => {
    let result = template;
    Object.keys(variables).forEach((key) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(placeholder, variables[key]);
    });
    return result;
  };

  const handleSend = async () => {
    const isValid = await validate();

    if (!isValid) return;

    try {
      let parsedVariables: Record<string, string> | null = null;
      try {
        parsedVariables = JSON.parse(variables);
      } catch (e) {
        console.error('Invalid JSON in variables:', e);
      }

      let processedBody = body;
      if (parsedVariables) {
        processedBody = replacePlaceholdersWithVariables(body, parsedVariables);
      }

      const bodyJson = JSON.stringify(processedBody)
        .replace(/\\n/g, '')
        .replace(/\s+/g, ' ');

      const url = buildRestfulApiUrl({
        method,
        endpoint,
        body: bodyJson,
        headers,
      });

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const jsonResponse = await res.json();
      setResponse(JSON.stringify(jsonResponse, null, 2));
      setResponseStatus(res.status);

      const request: RequestHistoryItem = {
        id: uuidv4(),
        type: 'REST',
        timestamp: Date.now(),
        url: endpoint,
        method,
        headers,
        body,
      };

      saveRequestToLocalStorage(request);
    } catch (error) {
      setResponse('Error: ' + error.message);
    }
  };

  const handleHeaderChange = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const handleEndpointChange = (value: string) => {
    setEndpoint(value);
  };

  const formatCode = () => {
    try {
      const parsed = JSON.parse(body);
      const formatted = JSON.stringify(parsed, null, 2);
      setBody(formatted);
    } catch (error) {
      console.error('Failed to format JSON:', error);
    }
  };

  useEffect(() => {
    const uuid = searchParams.get('id');
    if (uuid) {
      const savedRequest = getRequestById(uuid);
      if (savedRequest) {
        setEndpoint(savedRequest?.url || '');
        setHeaders(savedRequest?.headers || []);
        setBody(savedRequest.body || '');
      }
    }
  }, [searchParams]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('restful_title')}
      </Typography>
      <Grid container spacing={2} xs={12}>
        <Grid item xs={2}>
          <HttpMethodSelector method={method} setMethod={setMethod} />
        </Grid>
        <Grid item xs={10}>
          <TextField
            fullWidth
            label={t('inputs.endpoint')}
            value={endpoint}
            onChange={(e) => handleEndpointChange(e.target.value)}
            variant="outlined"
            error={!!validationErrors?.endpoint}
            helperText={validationErrors?.endpoint}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{t('inputs.headers')}</Typography>
          <IconButton onClick={addHeader}>
            <AddCircleOutline color="primary" />
          </IconButton>
          {headers.map((header, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label={t('inputs.header_key', { index: index + 1 })}
                  value={header.key}
                  onChange={(e) =>
                    handleHeaderChange(index, 'key', e.target.value)
                  }
                  variant="outlined"
                  error={!!validationErrors.headers?.[index]?.key}
                  helperText={validationErrors.headers?.[index]?.key}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label={t('inputs.header_value', { index: index + 1 })}
                  value={header.value}
                  onChange={(e) =>
                    handleHeaderChange(index, 'value', e.target.value)
                  }
                  variant="outlined"
                  error={!!validationErrors.headers?.[index]?.value}
                  helperText={validationErrors.headers?.[index]?.value}
                />
              </Grid>
              <Grid
                item
                xs={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <IconButton onClick={() => removeHeader(index)}>
                  <RemoveCircleOutline color="error" />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{t('inputs.body')}</Typography>
          <Box>
            <CodeMirror
              className="editor"
              height="100%"
              value={body}
              theme={oneDark}
              onChange={(value) => setBody(value)}
              extensions={[json()]}
              ref={editorRef}
            />
            <Typography color="error">{validationErrors?.body}</Typography>
            <ButtonBase
              variant="contained"
              color="secondary"
              handleClick={formatCode}
            >
              <AutoFixHighIcon />
            </ButtonBase>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{t('inputs.variables_editor')}</Typography>
          <CodeMirror
            className="editor"
            width="100%"
            value={variables}
            theme={oneDark}
            onChange={(value) => setVariables(value)}
            extensions={[json()]}
          />
          <Typography color="error">{validationErrors.variables}</Typography>
        </Grid>
        <Grid item xs={12}>
          <ButtonBase
            variant="contained"
            color="primary"
            handleClick={handleSend}
          >
            {t('send')}
          </ButtonBase>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{t('response_status')}</Typography>
          <pre>{responseStatus}</pre>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{t('response')}</Typography>
          <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
            <pre>{response}</pre>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestfulApiPlayground;
