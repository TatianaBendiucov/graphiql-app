import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { HttpMethod } from '@/types/routesTypes';

interface HttpMethodSelectorProps {
    method: HttpMethod;
    setMethod: (method: HttpMethod) => void;
}

const HttpMethodSelector: React.FC<HttpMethodSelectorProps> = ({ method, setMethod }) => {
    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel id="http-method-select-label">HTTP Method</InputLabel>
            <Select
                labelId="http-method-select-label"
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                label="HTTP Method"
            >
                {Object.values(HttpMethod).map((httpMethod) => (
                    <MenuItem key={httpMethod} value={httpMethod}>
                        {httpMethod}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default HttpMethodSelector;