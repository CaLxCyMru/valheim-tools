import { useSession } from 'next-auth/client';
import React, { SyntheticEvent } from 'react';
import { Icon, Placeholder } from 'semantic-ui-react';
import { Role, SeedAssetType } from '../../enums';
import { AuthUser } from '../../models';
import { ISeed } from '../../models/seeds/seed.model';
import styles from '../../styles/components/seeds/SeedAssets.module.scss';
import { Loadable, SessionUser } from '../../types';
import ImageCarousel from '../carousel/ImageCarousel';

const SLIDE_INTERVAL = Number(process.env.NEXT_PUBLIC_SEEDS_SLIDE_INTERVAL ?? 5) * 1000;
const BASE_ASSETS_URL = String(process.env.NEXT_PUBLIC_SEED_ASSET_BASE_URL);

const SeedAssets = ({
  createdBy,
  assets,
  assetTypes,
  loading,
}: Pick<ISeed, 'createdBy' | 'assets'> &
  Loadable & { assetTypes?: SeedAssetType[] }): JSX.Element => {
  const [session] = useSession();
  const user = session?.user as SessionUser;

  // TODO: Return via API?
  const canDelete = user?.id === (createdBy as AuthUser)?.id || user?.role === Role.ADMIN;

  const deleteSeed = (e: SyntheticEvent) => {
    e?.preventDefault();
    if (!canDelete) {
      alert('No permission to delete this seed');
      return;
    }

    alert('Call delete api');
  };

  const loader = () => (
    <Placeholder>
      <Placeholder.Image square />
    </Placeholder>
  );

  const icon = <Icon className="link" name="trash" />;

  const buildImage = (path: string) => {
    return {
      className: `${styles.image} ${canDelete ? styles.delete : ''}`,
      label: canDelete
        ? {
            color: 'red',
            corner: 'right',
            icon,
            onClick: deleteSeed,
            size: 'large',
          }
        : undefined,
      src: `${BASE_ASSETS_URL}/${path}`,
    };
  };

  const render = () => {
    if (loading) {
      return loader();
    }

    const filtered = assets.filter(({ type }) => !assetTypes || assetTypes.includes(type));
    return (
      <ImageCarousel
        className={styles.assets}
        slides={filtered.map(({ path }) => buildImage(path))}
        infinite={true}
        interval={SLIDE_INTERVAL}
        isPlaying={true}
        hideDots={true}
      />
    );
  };

  return render();
};

export default SeedAssets;
