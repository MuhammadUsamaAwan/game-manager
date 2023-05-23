'use client';
import useTableFilter from '@/hooks/useTableFilter';
import { Button, ConfigProvider, Table, Tag, Typography, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Game {
  name: string;
  year: number;
  score: number;
  status: string;
}

export default function Recover() {
  const { data, isLoading, mutate } = useSWR<Game[]>('/api/games/deleted', fetcher);
  const filter = useTableFilter();

  const recoverGame = async (name: string) => {
    await fetch(`/api/games/${name}/recover`, {
      method: 'PATCH',
    });
    mutate();
  };

  const getColor = (status: string) => {
    if (status === 'COMPLETED' || status === 'COMPLETED SEQUEL') return 'success';
    else if (status === 'NOT FOR ME') return 'warning';
    else return 'default';
  };

  const columns: ColumnsType<Game> = [
    {
      title: 'Name',
      dataIndex: 'name',
      ...filter('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: '30%',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      ...filter('year'),
      align: 'center',
      sorter: (a, b) => a.year - b.year,
      width: '15%',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      ...filter('score'),
      align: 'center',
      sorter: (a, b) => a.score - b.score,
      width: '15%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      ...filter('status'),
      render: (_, { status }) => <Tag color={getColor(status)}>{status}</Tag>,
      align: 'center',
      sorter: (a, b) => a.status.localeCompare(b.status),
      width: '20%',
    },
    {
      title: 'Actions',
      align: 'center',
      render: (_, { name }) => <Button onClick={() => recoverGame(name)}>Recover</Button>,
      width: '30%',
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
      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={{ showTotal: total => `Total ${total} Games` }}
        scroll={{ x: 'max-content' }}
      />
    </ConfigProvider>
  );
}
