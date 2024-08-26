'use client';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';
import { cookieName, fallbackLng, languages } from '@/components/i18n/settings';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie } from 'cookies-next';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const [lng, setLng] = useState(getCookie(cookieName) || fallbackLng);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    const selectedLng = event.target.value as string;
    setCookie(cookieName, selectedLng);
    setLng(selectedLng);
    router.refresh();
  };

  return (
    <Select
      value={lng}
      onChange={handleLanguageChange}
      variant="outlined"
      style={{ marginLeft: 10 }}
    >
      {languages.map((l) => (
        <MenuItem key={l} value={l}>
          {l}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSwitcher;
