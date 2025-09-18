import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, CardContent, Divider, Stack, TextField, Typography, Box } from '@mui/material';
import { Logger } from '../logging/logger';
import { isCodeTaken, addUrls } from '../storage/storage';
import { ShortUrl } from '../storage/types';
import { generateShortCode, isValidCustomCode } from '../utils/shortcode';
import { isValidUrl, parseValidityMinutes } from '../utils/validation';

interface RowInput {
  url: string;
  minutes?: string;
  code?: string;
}

const MAX_ROWS = 5;
const DEFAULT_MINUTES = 30;

function computeExpiry(minutes?: number): string {
  const mins = minutes && minutes > 0 ? minutes : DEFAULT_MINUTES;
  return new Date(Date.now() + mins * 60 * 1000).toISOString();
}

export default function ShortenerPage() {
  const [rows, setRows] = useState<RowInput[]>([{ url: '' }]);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ShortUrl[] | null>(null);

  const canAddRow = rows.length < MAX_ROWS;

  const handleAddRow = () => {
    setRows(prev => [...prev, { url: '' }]);
  };

  const handleChange = (index: number, field: keyof RowInput, value: string) => {
    setRows(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const validate = (): string | null => {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!isValidUrl(r.url)) return `Row ${i + 1}: Invalid URL`;
      const mins = parseValidityMinutes(r.minutes);
      if (r.minutes && Number.isNaN(mins)) return `Row ${i + 1}: Validity must be a positive integer`;
      if (r.code) {
        if (!isValidCustomCode(r.code)) return `Row ${i + 1}: Invalid shortcode (alphanumeric, 3-20 chars)`;
        if (isCodeTaken(r.code)) return `Row ${i + 1}: Shortcode already taken`;
      }
    }
    return null;
  };

  const handleShorten = () => {
    setError(null);
    setResults(null);

    const err = validate();
    if (err) {
      setError(err);
      Logger.warn('shorten:validation:error', { error: err });
      return;
    }

    const created: ShortUrl[] = rows.map(r => {
      let code = r.code && isValidCustomCode(r.code) && !isCodeTaken(r.code) ? r.code : '';
      // Ensure uniqueness
      while (!code || isCodeTaken(code)) {
        code = generateShortCode(6);
      }
      const minutes = parseValidityMinutes(r.minutes);
      return {
        id: crypto.randomUUID(),
        code,
        longUrl: r.url,
        createdAt: new Date().toISOString(),
        expiresAt: computeExpiry(minutes === undefined ? undefined : Number(minutes)),
        custom: !!r.code,
      } as ShortUrl;
    });

    try {
      addUrls(created);
      setResults(created);
      Logger.info('shorten:success', { count: created.length });
    } catch (e) {
      setError('Failed to save short URLs');
      Logger.error('shorten:save:error', { error: String(e) });
    }
  };

  const baseUrl = useMemo(() => {
    return window.location.origin + '/';
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Shorten URLs</Typography>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            {rows.map((r, idx) => (
              <Box key={idx} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 2 }}>
                <TextField fullWidth label="Long URL" value={r.url} onChange={e => handleChange(idx, 'url', e.target.value)} />
                <TextField fullWidth label="Validity (min)" value={r.minutes || ''} onChange={e => handleChange(idx, 'minutes', e.target.value)} />
                <TextField fullWidth label="Custom code (optional)" value={r.code || ''} onChange={e => handleChange(idx, 'code', e.target.value)} />
              </Box>
            ))}
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleAddRow} disabled={!canAddRow}>Add Row</Button>
              <Button variant="contained" onClick={handleShorten}>Shorten</Button>
            </Stack>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Results</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1}>
              {results.map(r => (
                <Stack key={r.id}>
                  <Typography variant="body1">{r.longUrl}</Typography>
                  <Typography variant="body2">
                    Short: {baseUrl}{r.code} — Expires: {new Date(r.expiresAt).toLocaleString()}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}


