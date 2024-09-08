'use client';

import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { graphql } from 'cm6-graphql';
import { json } from '@codemirror/lang-json'; // Import the JSON language
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { buildGraphQLUrl } from '@/utils/utils';
import { schema } from '@/utils/validations/GraphiQLSchema';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import * as Yup from 'yup';
import { formatSdl } from 'format-graphql';
import { useTranslation } from './i18n/client';
import {
  getRequestById,
  RequestHistoryItem,
  saveRequestToLocalStorage,
} from '@/utils/localStorageHelpers';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'next/navigation';
import ButtonBase from './Button';
import withAuth from '../utils/withAuth';
import useAuth from '@/hooks/useAuth';
import { showToast } from './ShowToast';

const validationErrorsInit = {
  endpoint: '',
  sdlEndpoint: '',
  headers: [],
  variables: '',
  query: '',
  body: '',
};

const GraphQLPlayground = () => {
  const currentUser = useAuth().currentUser!;
  const loading = useAuth().loading;
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [endpoint, setEndpoint] = useState<string>(
    'https://rickandmortyapi.com/graphql',
  );
  const [sdlEndpoint, setSdlEndpoint] = useState<string>(`${endpoint}?sdl`);
  const [query, setQuery] = useState<string>(`query ($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      gender
      image
      created
    }
  }
`);
  const [response, setResponse] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [sdlResponse, setSdlResponse] = useState<string | null>(null);
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [variables, setVariables] = useState<string>('{"id": "2"}');
  const [validationErrors, setValidationErrors] = useState({
    ...validationErrorsInit,
  });
  const editorRef = useRef(null);

  const validate = async () => {
    try {
      await schema(t).validate(
        {
          endpoint,
          sdlEndpoint,
          query,
          variables,
          headers,
        },
        { abortEarly: false },
      );
      setValidationErrors({});
      return true;
    } catch (err) {
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

  const handleSdlQuery = async () => {
    const isValid = await validate();
    if (!isValid) return;

    const bodyObject: Record<string, string | object> = {};
    const token = await currentUser.getIdToken();

    bodyObject.query = query;
    let variablesOb: object | null;
    try {
      variablesOb = JSON.parse(variables);
    } catch (e) {
      variablesOb = null;
    }
    if (variablesOb) {
      bodyObject.variables = variablesOb;
    }

    const body = JSON.stringify(bodyObject)
      .replace(/\\n/g, '')
      .replace(/\s+/g, ' ');

    const sdlResponse = await fetch(
      buildGraphQLUrl({
        endpoint: sdlEndpoint,
        body: body,
        headers,
      }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (sdlResponse.ok) {
      const jsonSdlResponse = await sdlResponse.json();
      setSdlResponse(JSON.stringify(jsonSdlResponse, null, 2));
    }
  };

  const handleRunQuery = async () => {
    const isValid = await validate();
    const token = await currentUser.getIdToken();
    if (!isValid) return;

    try {
      const bodyObject: Record<string, string | object> = {};

      bodyObject.query = query;
      let variablesOb: object | null;
      try {
        variablesOb = JSON.parse(variables);
      } catch (e) {
        variablesOb = null;
      }
      if (variablesOb) {
        bodyObject.variables = variablesOb;
      }

      const body = JSON.stringify(bodyObject)
        .replace(/\\n/g, '')
        .replace(/\s+/g, ' ');

      const url = buildGraphQLUrl({ endpoint, body, headers });
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        showToast('error', `${t('http_error_status')} ${res.status}`);
      }

      const jsonResponse = await res.json();
      setResponse(JSON.stringify(jsonResponse, null, 2));
      setResponseStatus(res.status);

      const requestForHistory: RequestHistoryItem = {
        id: uuidv4(),
        type: 'GraphQL',
        timestamp: Date.now(),
        url: endpoint,
        method: '',
        headers,
        body: query,
        variables: JSON.stringify(variablesOb) || '{}',
        sdl: sdlEndpoint,
      };

      saveRequestToLocalStorage(currentUser.uid, requestForHistory);
    } catch (error) {
      setResponse(`${t('error')} ${error.message}`);
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
    setSdlEndpoint(value ? `${value}?sdl` : '');
  };

  const formatCode = () => {
    const formatted = formatSdl(query);
    setQuery(formatted);
  };

  useEffect(() => {
    if (!loading && currentUser) {
      const uuid = searchParams.get('id');
      if (uuid) {
        const savedRequest = getRequestById(currentUser.uid, uuid);

        if (savedRequest) {
          setEndpoint(savedRequest.url || '');
          setSdlEndpoint(savedRequest.sdl || '');
          setHeaders(savedRequest.headers || []);
          setVariables(savedRequest.variables || '{}');
          setQuery(savedRequest.body || '');
        }
      }
    }
  }, [searchParams, currentUser, loading]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('title_graphiql')}
      </Typography>
      <Grid spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
            <TextField
              fullWidth
              label={t('inputs.sdl_endpoint')}
              value={sdlEndpoint}
              onChange={(e) => setSdlEndpoint(e.target.value)}
              variant="outlined"
              error={!!validationErrors?.sdlEndpoint}
              helperText={validationErrors?.sdlEndpoint}
            />
            <ButtonBase
              variant="contained"
              color="primary"
              handleClick={handleSdlQuery}
              fullWidth
            >
              {t('sdl_run')}
            </ButtonBase>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">{t('inputs.headers')}</Typography>
          <IconButton onClick={addHeader}>
            <AddCircleOutline color="primary" />
          </IconButton>
          {headers.map((header, index) => {
            const thisError = validationErrors.headers?.[index];

            return (
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
                    error={!!thisError?.key}
                    helperText={thisError?.key}
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
                    error={!!thisError?.value}
                    helperText={thisError?.value}
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
            );
          })}
        </Grid>

        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Box sx={{ width: '50%' }}>
            <Typography variant="h6">
              {t('query_editor')}
              <ButtonBase
                variant="contained"
                color="secondary"
                handleClick={formatCode}
              >
                <AutoFixHighIcon />
              </ButtonBase>
            </Typography>
            <CodeMirror
              className="editor"
              height="100%"
              value={query}
              theme={oneDark}
              onChange={(value) => setQuery(value)}
              extensions={[graphql()]}
              ref={editorRef}
            />
            <Typography color="error">{validationErrors?.query}</Typography>
          </Box>

          <Box sx={{ width: '50%' }}>
            <Typography variant="h6">{t('variables_editor')}</Typography>
            <CodeMirror
              className="editor"
              width="100%"
              value={variables}
              theme={oneDark}
              onChange={(value) => setVariables(value)}
              extensions={[json()]}
            />
            <Typography color="error">{validationErrors.variables}</Typography>
          </Box>
        </Stack>

        <Grid item xs={12}>
          <ButtonBase
            variant="contained"
            color="primary"
            handleClick={handleRunQuery}
            fullWidth
          >
            {t('run_query')}
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
        {sdlResponse ? (
          <Grid item xs={12}>
            <Typography variant="h6">{t('sdl_doc')}</Typography>
            <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
              <pre>{sdlResponse}</pre>
            </Paper>
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    </Box>
  );
};

export default withAuth(GraphQLPlayground);
