import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { HttpMethod } from '@/types/routesTypes';
import { useTranslation } from '../i18n/client';

interface HttpMethodSelectorProps {
  method: HttpMethod;
  setMethod: (method: HttpMethod) => void;
}

const HttpMethodSelector: React.FC<HttpMethodSelectorProps> = ({
  method,
  setMethod,
}) => {
  const { t } = useTranslation();

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="http-method-select-label">
        {t('inputs.http_method')}
      </InputLabel>
      <Select
        labelId="http-method-select-label"
        value={method}
        onChange={(e) => setMethod(e.target.value as HttpMethod)}
        label={t('inputs.http_method')}
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
