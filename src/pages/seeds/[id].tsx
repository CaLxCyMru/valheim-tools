import { useRouter } from 'next/router';
import React from 'react';
import { Card, Message, Placeholder } from 'semantic-ui-react';
import useSWR from 'swr';
import { withLayout } from '../../components';
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

  const loading = () => {
    return (
      <Card.Content>
        <Card.Header>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length="medium" />
            </Placeholder.Header>
          </Placeholder>
        </Card.Header>
      </Card.Content>
    );
  };

  const component = () => {
    // return loading();

    if (!data && !error) {
      return loading();
    }

    if (error && !data) {
      const { title, message } = parseApiError(error);
      return <Message error header={title} content={message} />;
    }

    const { seed } = data;

    return (
      <>
        <Card.Content>
          <Card.Header size="large" content={seed} />
        </Card.Content>
      </>
    );
  };

  return (
    <Card fluid className={styles.seedDetail}>
      {component()}
      {/* <Header size={'large'}>{seed}</Header>
      <span>{JSON.stringify(responseData)}</span> */}
    </Card>
  );
};

export default withLayout(SeedDetail);
