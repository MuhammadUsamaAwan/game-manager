'use client';
import { useState } from 'react';
import useTableFilter from '@/hooks/useTableFilter';
import { Button, ConfigProvider, Dropdown, Form, Input, InputNumber, Modal, Popconfirm, Table, Tag, theme } from 'antd';
import type { MenuProps } from 'antd';
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
  const { data, isLoading, mutate } = useSWR<Game[]>('/api/games', fetcher);
  const [name, setName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const filter = useTableFilter();

  const changeStatus = async (status: string) => {
    await fetch(`/api/games/${name}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    mutate();
  };

  const deleteGame = async (name: string) => {
    await fetch(`/api/games/${name}`, {
      method: 'DELETE',
    });
    mutate();
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'PENDING',
      onClick: () => changeStatus('PENDING'),
    },
    {
      key: '2',
      label: 'COMPLETED',
      onClick: () => changeStatus('COMPLETED'),
    },
    {
      key: '3',
      label: 'COMPLETED SEQUEL',
      onClick: () => changeStatus('COMPLETED SEQUEL'),
    },
    {
      key: '4',
      label: 'NOT FOR ME',
      onClick: () => changeStatus('NOT FOR ME'),
    },
  ];

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
      ...filter('status'),
      render: (_, { status }) => <Tag color={getColor(status)}>{status}</Tag>,
      align: 'center',
      sorter: (a, b) => a.status.localeCompare(b.status),
      width: '20%',
    },
    {
      title: 'Actions',
      align: 'center',
      render: (_, { name }) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <Dropdown menu={{ items }} trigger={['click']} placement='bottom' onOpenChange={() => setName(name)}>
            <Button>Change Status</Button>
          </Dropdown>
          <Popconfirm
            title='Delete'
            description='Are you sure to delete this?'
            onConfirm={() => deleteGame(name)}
            okText='Yes'
            cancelText='No'
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
      width: '30%',
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h1 style={{ textAlign: 'center', flex: 1, margin: 0, fontSize: '24px' }}>Game Manager</h1>
        <Button onClick={() => setIsModalOpen(true)}>Scrap New Data</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={{ showTotal: total => `Total ${total} Games` }}
        scroll={{ x: 'max-content' }}
        rowKey='name'
      />
      <Modal
        title='Scrap New Data'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key='cancel' onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button form='scrapNewDataForm' key='submit' type='primary' htmlType='submit' loading={loading}>
            Submit
          </Button>,
        ]}
        destroyOnClose
      >
        <Form
          id='scrapNewDataForm'
          onFinish={async (values: { page: number }) => {
            setLoading(true);
            await fetch(`/api/games/scrap`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ page: values.page }),
            });
            setLoading(false);
            setIsModalOpen(false);
            mutate();
          }}
        >
          <Form.Item
            label='Number of Pages'
            name='page'
            rules={[{ required: true, message: 'Please enter number of pages!' }]}
          >
            <InputNumber placeholder='Enter Number of Pages' style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}
