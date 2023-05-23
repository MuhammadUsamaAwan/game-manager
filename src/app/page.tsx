'use client';
import useTableFilter from '@/hooks/useTableFilter';
import { Button, ConfigProvider, Table, Typography, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Game {
  name: string;
  year: number;
  score: number;
  status: string;
}

export default function Home() {
  const { data, isLoading } = useSWR<Game[]>('/api/games', fetcher);
  const filter = useTableFilter();

  const columns: ColumnsType<Game> = [
    {
      title: 'Name',
      dataIndex: 'name',
      ...filter('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Year',
      dataIndex: 'year',
      ...filter('year'),
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      ...filter('score'),
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      ...filter('status'),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Typography.Title level={3} style={{ textAlign: 'center' }}>
        Game Manager
      </Typography.Title>
      <Table columns={columns} dataSource={data} loading={isLoading} />
    </ConfigProvider>
  );
}
