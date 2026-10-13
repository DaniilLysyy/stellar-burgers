import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useEffect } from 'react';

import {
  fetchFeed,
  selectFeedOrders,
  selectFeedLoading,
  selectFeedError
} from '../../services/feedSlice';

import {
  useDispatch,
  useSelector
} from '../../services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  const handleGetFeeds = (): void => {
    dispatch(fetchFeed());
  };

  useEffect(() => {
    handleGetFeeds();
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-medium'>
        Не удалось загрузить ленту заказов: {error}
      </p>
    );
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={handleGetFeeds}
    />
  );
};