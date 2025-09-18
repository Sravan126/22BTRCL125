import React, { useMemo } from 'react';
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { getAllUrls, getClicksByCode } from '../storage/storage';

export default function StatsPage() {
  const urls = getAllUrls();
  const baseUrl = useMemo(() => window.location.origin + '/', []);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Statistics</Typography>
      {urls.map(u => {
        const clicks = getClicksByCode(u.code);
        return (
          <Card key={u.id}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">{baseUrl}{u.code}</Typography>
                <Typography variant="body2">Created: {new Date(u.createdAt).toLocaleString()} — Expires: {new Date(u.expiresAt).toLocaleString()}</Typography>
                <Typography variant="body2">Total Clicks: {clicks.length}</Typography>
                {clicks.length > 0 && (
                  <>
                    <Divider />
                    <Stack spacing={0.5}>
                      {clicks.map(c => (
                        <Typography key={c.id} variant="body2">
                          {new Date(c.timestamp).toLocaleString()} — {c.source}{c.location ? ` — ${c.location}` : ''}
                        </Typography>
                      ))}
                    </Stack>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}


