import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AnalyticsSummary, FilterKey, Weights, Zone, ZoneDetail } from '../types';

const BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:4000/api';

export const api = axios.create({ baseURL: BASE });

export const useZones = (filter: FilterKey) =>
  useQuery({
    queryKey: ['zones', filter],
    queryFn: async () => {
      const { data } = await api.get<Zone[]>('/zones', {
        params: filter !== 'all' ? { filter } : {},
      });
      return data;
    },
  });

export const useZone = (id?: string) =>
  useQuery({
    queryKey: ['zone', id],
    queryFn: async () => {
      const { data } = await api.get<ZoneDetail>(`/zones/${id}`);
      return data;
    },
    enabled: !!id,
  });

export const useSummary = () =>
  useQuery({
    queryKey: ['summary'],
    queryFn: async () => (await api.get<AnalyticsSummary>('/analytics/summary')).data,
  });

export const useWeights = () =>
  useQuery({
    queryKey: ['weights'],
    queryFn: async () => (await api.get<Weights>('/config/weights')).data,
  });

export const useUpdateWeights = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (w: Weights) => (await api.patch<Weights>('/config/weights', w)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['zones'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
      qc.invalidateQueries({ queryKey: ['zone'] });
      qc.invalidateQueries({ queryKey: ['weights'] });
    },
  });
};

export const useUploadZones = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/zones/upload', fd);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['zones'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
    },
  });
};

export const useCreateZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Zone>) => (await api.post<Zone>('/zones', payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['zones'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
    },
  });
};

export const useSeed = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.post('/seed')).data,
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
};
