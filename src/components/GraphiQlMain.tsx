'use client';

import React, { useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { graphql } from 'cm6-graphql';
import { json } from '@codemirror/lang-json'; // Import the JSON language
import { Box, Button, Grid, Paper, TextField, Typography, IconButton } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { buildGraphQLUrl } from '@/utils/utils';
import { schema } from '@/utils/validations/GraphiQLSchema';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import * as Yup from 'yup';
import {formatSdl} from 'format-graphql';
import { useTranslation } from './i18n/client';

const GraphQLPlayground = () => {
    const { t } = useTranslation();
    const [endpoint, setEndpoint] = useState<string>("");
    const [sdlEndpoint, setSdlEndpoint] = useState<string>(`${endpoint}?sdl`);
    const [query, setQuery] = useState<string>("");
    const [response, setResponse] = useState<string | null>(null);
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    const [sdlResponse, setSdlResponse] = useState<string | null>(null);
    // const [error, setError] = useState<string | null>(null);
    const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
        { key: "", value: "" },
    ]);
    const [variables, setVariables] = useState<string>("{}");
    const [validationErrors, setValidationErrors] = useState<object>({});
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
                { abortEarly: false }
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

    const handleRunQuery = async () => {
        const isValid = await validate();
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
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const sdlResponse = await fetch(
                buildGraphQLUrl(
                    {
                        endpoint: sdlEndpoint,
                        body: body,
                        headers
                    }
                ),
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            if (sdlResponse.ok) {
                const jsonSdlResponse = await sdlResponse.json();
                setSdlResponse(JSON.stringify(jsonSdlResponse, null, 2));
            }

            const jsonResponse = await res.json();
            setResponse(JSON.stringify(jsonResponse, null, 2));
            setResponseStatus(res.status);
        } catch (error) {
            setResponse("Error: " + error.message);
        }
    };

    const handleHeaderChange = (index: number, field: "key" | "value", value: string) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const addHeader = () => {
        setHeaders([...headers, { key: "", value: "" }]);
    };

    const removeHeader = (index: number) => {
        const newHeaders = headers.filter((_, i) => i !== index);
        setHeaders(newHeaders);
    };

    const handleEndpointChange = (value: string) => {
        setEndpoint(value);
        setSdlEndpoint(value ? `${value}?sdl` : "");
    };

    const formatCode = () => {
        const formatted = formatSdl(query);
        setQuery(formatted);
    };
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                GraphQL Playground
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Endpoint (URL)"
                        value={endpoint}
                        onChange={(e) => handleEndpointChange(e.target.value)}
                        variant="outlined"
                        error={!!validationErrors.endpoint}
                        helperText={validationErrors.endpoint}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="SDL Endpoint (URL)"
                        value={sdlEndpoint}
                        onChange={(e) => setSdlEndpoint(e.target.value)}
                        variant="outlined"
                        error={!!validationErrors.sdlEndpoint}
                        helperText={validationErrors.sdlEndpoint}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Headers</Typography><IconButton onClick={addHeader}>
                        <AddCircleOutline color="primary" />
                    </IconButton>
                    {headers.map((header, index) => (
                        <Grid container spacing={2} key={index}>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    label={`Header Key ${index + 1}`}
                                    value={header.key}
                                    onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
                                    variant="outlined"
                                    error={!!validationErrors.headers?.[index]?.key}
                                    helperText={validationErrors.headers?.[index]?.key}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    label={`Header Value ${index + 1}`}
                                    value={header.value}
                                    onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
                                    variant="outlined"
                                    error={!!validationErrors.headers?.[index]?.value}
                                    helperText={validationErrors.headers?.[index]?.value}
                                />
                            </Grid>
                            <Grid item xs={2} display="flex" alignItems="center" justifyContent="center">
                                <IconButton onClick={() => removeHeader(index)}>
                                    <RemoveCircleOutline color="error" />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Query Editor</Typography>
                    <Box>
                        <CodeMirror
                            className="editor"
                            height="100%"
                            value={query}
                            theme={oneDark}
                            onChange={(value) => setQuery(value)}
                            extensions={[graphql()]}
                            ref={editorRef}
                        />
                        <Typography color="error">{validationErrors.query}</Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={formatCode}
                            sx={{ mt: 1 }}
                        >
                            <AutoFixHighIcon />
                        </Button>
                    </Box>

                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Variables Editor</Typography>
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRunQuery}
                    >
                        Run Query
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Response Status</Typography>
                    <pre>{responseStatus}</pre>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Response</Typography>
                    <Paper sx={{ p: 2, maxHeight: 300, overflow: "auto" }}>
                        <pre>{response}</pre>
                    </Paper>
                </Grid>
                {sdlResponse ?
                    <Grid item xs={12}>
                        <Typography variant="h6">SDL Documentation</Typography>
                        <Paper sx={{ p: 2, maxHeight: 300, overflow: "auto" }}>
                            <pre>{sdlResponse}</pre>
                        </Paper>
                    </Grid>
                    : ''
                }
            </Grid>
        </Box>
    );
};

export default GraphQLPlayground;
