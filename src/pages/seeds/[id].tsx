import { useRouter } from 'next/router';
import React from 'react';
import { Card, Message } from 'semantic-ui-react';
import useSWR from 'swr';
import { SeedAssets, SeedBody, SeedMeta, SeedTags, withLayout } from '../../components';
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

    console.log(data);
    const { seed, title, description, assets, created, overview, tags, createdBy } = data ?? {};

    return (
      <>
        <SeedAssets assets={assets} createdBy={createdBy} loading={loading} />
        <SeedBody seed={seed} title={title} description={description} loading={loading} />
        <SeedMeta
          seed={seed}
          created={created}
          createdBy={createdBy}
          overview={overview}
          loading={loading}
        />
        <SeedTags tags={tags} loading={loading} />
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
