import { NextRequest, NextResponse } from 'next/server';

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || '';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'list';
  const id = searchParams.get('id');

  if (!APPS_SCRIPT_URL) {
    return NextResponse.json({ error: 'API URL not configured' }, { status: 500 });
  }

  let url = `${APPS_SCRIPT_URL}?action=${action}`;
  if (id) url += `&id=${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch wallpapers' }, { status: 500 });
  }
}
