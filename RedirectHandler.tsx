import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Alert, CircularProgress, Stack, Typography } from '@mui/material';
import { addClick, getUrlByCode } from '../storage/storage';
import { Logger } from '../logging/logger';

function getSourceFromLocation(pathname: string): string {
  if (pathname.startsWith('/stats')) return 'stats';
  return 'shortener';
}

async function getCoarseLocation(): Promise<string | undefined> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data && (data.city || data.country_name)) {
      return [data.city, data.country_name].filter(Boolean).join(', ');
    }
  } catch (e) {
    Logger.warn('location:lookup:failed', { error: String(e) });
  }
  return undefined;
}

export default function RedirectHandler() {
  const { code } = useParams<{ code: string }>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      if (!code) return;
      const record = getUrlByCode(code);
      if (!record) {
        setError('Short URL not found');
        Logger.warn('redirect:not_found', { code });
        return;
      }
      const now = Date.now();
      const exp = Date.parse(record.expiresAt);
      if (!isNaN(exp) && exp <= now) {
        setError('This short URL has expired');
        Logger.info('redirect:expired', { code });
        return;
      }
      try {
        const coarse = await getCoarseLocation();
        addClick({
          id: crypto.randomUUID(),
          code,
          timestamp: new Date().toISOString(),
          source: getSourceFromLocation(location.pathname),
          location: coarse,
        });
      } catch (e) {
        Logger.warn('click:record:failed', { error: String(e) });
      }
      window.location.replace(record.longUrl);
    })();
  }, [code, navigate, location.pathname]);

  if (error) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">{error}</Alert>
        <Typography variant="body2">You can go back to the home page to create a new link.</Typography>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" spacing={2}>
      <CircularProgress />
      <Typography>Redirecting…</Typography>
    </Stack>
  );
}


