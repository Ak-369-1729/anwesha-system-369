'use client';
import { useSky } from '@/hooks/useSky';

/** Keep shared mission routes in the same sky as the story that opened them. */
export default function SkyBridge() {
  useSky();
  return null;
}
