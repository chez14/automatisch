import React, { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { UPDATE_APP_AUTH_CLIENT } from 'graphql/mutations/update-app-auth-client';
import useFormatMessage from 'hooks/useFormatMessage';
import AdminApplicationAuthClientDialog from 'components/AdminApplicationAuthClientDialog';
import useAdminAppAuthClient from 'hooks/useAdminAppAuthClient.ee';

export default function AdminApplicationUpdateAuthClient(props) {
  const { application, onClose } = props;
  const { auth } = application;
  const formatMessage = useFormatMessage();
  const { clientId } = useParams();

  const { data: adminAppAuthClient, isLoading: isAdminAuthClientLoading } =
    useAdminAppAuthClient(clientId);

  const [updateAppAuthClient, { loading: loadingUpdateAppAuthClient, error }] =
    useMutation(UPDATE_APP_AUTH_CLIENT, {
      refetchQueries: ['GetAppAuthClients'],
      context: { autoSnackbar: false },
    });

  const authFields = auth?.fields?.map((field) => ({
    ...field,
    required: false,
  }));

  const submitHandler = async (values) => {
    if (!adminAppAuthClient) {
      return;
    }

    const { name, active, ...formattedAuthDefaults } = values;

    await updateAppAuthClient({
      variables: {
        input: {
          id: adminAppAuthClient.data.id,
          name,
          active,
          formattedAuthDefaults,
        },
      },
    });

    onClose();
  };

  const getAuthFieldsDefaultValues = useCallback(() => {
    if (!authFields) {
      return {};
    }

    const defaultValues = {};
    authFields.forEach((field) => {
      if (field.value || field.type !== 'string') {
        defaultValues[field.key] = field.value;
      } else if (field.type === 'string') {
        defaultValues[field.key] = '';
      }
    });
    return defaultValues;
  }, [auth?.fields]);

  const defaultValues = useMemo(
    () => ({
      name: adminAppAuthClient?.data?.name || '',
      active: adminAppAuthClient?.data?.active || false,
      ...getAuthFieldsDefaultValues(),
    }),
    [adminAppAuthClient, getAuthFieldsDefaultValues],
  );

  return (
    <AdminApplicationAuthClientDialog
      onClose={onClose}
      error={error}
      title={formatMessage('updateAuthClient.title')}
      loading={isAdminAuthClientLoading}
      submitHandler={submitHandler}
      authFields={authFields}
      submitting={loadingUpdateAppAuthClient}
      defaultValues={defaultValues}
      disabled={!adminAppAuthClient}
    />
  );
}