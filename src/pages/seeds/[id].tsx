import { useRouter } from 'next/router';
import React from 'react';
import { Card, Message, Placeholder } from 'semantic-ui-react';
import useSWR from 'swr';
import { SeedAssets, SeedBody, withLayout } from '../../components';
import { ISeed } from '../../models';
import styles from '../../styles/pages/SeedDetail.module.scss';
import { ApiResponse } from '../../types';
import { parseApiError } from '../../utils';

const API_URL = '/api/seeds';
const REFRESH_INTERVAL = 10 * 1000;

const SeedDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: responseData } = useSWR<ApiResponse<ISeed>>(`${API_URL}/${id}`, {
    refreshInterval: REFRESH_INTERVAL,
  });

  const { data, error } = responseData ?? {};

  const loading = !data && !error;

  const component = () => {
    if (error && !data) {
      const { title, message } = parseApiError(error);
      return <Message error header={title} content={message} />;
    }

    const { seed, title, description, assets, createdBy } = data ?? {};

    return (
      <>
        <SeedBody seed={seed} title={title} description={description} loading={loading} />
        <SeedAssets assets={assets} createdBy={createdBy} loading={loading} />
      </>
    );
  };

  return (
    <Card fluid className={styles.seedDetail}>
      {component()}
    </Card>
  );
};

export default withLayout(SeedDetail);
