import { Text, Classes, Button, Intent, Tag } from '@blueprintjs/core';
import clsx from 'classnames';
import { AppToaster, Box, Group, Stack } from '@/components';
import { usePaymentPortalBoot } from './PaymentPortalBoot';
import { useDrawerActions } from '@/hooks/state';
import { useCreateStripeCheckoutSession } from '@/hooks/query/payment-link';
import { DRAWERS } from '@/constants/drawers';
import styles from './PaymentPortal.module.scss';

export function PaymentPortal() {
  const { openDrawer } = useDrawerActions();
  const { sharableLinkMeta, linkId } = usePaymentPortalBoot();
  const {
    mutateAsync: createStripeCheckoutSession,
    isLoading: isStripeCheckoutLoading,
  } = useCreateStripeCheckoutSession();

  // Handles invoice preview button click.
  const handleInvoicePreviewBtnClick = () => {
    openDrawer(DRAWERS.PAYMENT_INVOICE_PREVIEW);
  };
  // handles the pay button click.
  const handlePayButtonClick = () => {
    createStripeCheckoutSession({ linkId })
      .then((session) => {
        window.open(session.redirectTo);
      })
      .catch((error) => {
        AppToaster.show({
          intent: Intent.DANGER,
          message: 'Something went wrong.',
        });
      });
  };

  return (
    <Box className={styles.root}>
      <Stack spacing={0} className={styles.body}>
        <Stack>
          <Group spacing={10}>
            {sharableLinkMeta?.organization?.logoUri && (
              <Box
                className={styles.companyLogoWrap}
                style={{
                  backgroundImage: `url(${sharableLinkMeta?.organization?.logoUri})`,
                }}
              ></Box>
            )}
            <Text>{sharableLinkMeta?.organization?.name}</Text>
          </Group>

          <Stack spacing={6}>
            <h1 className={styles.bigTitle}>
              {sharableLinkMeta?.organization?.name} Sent an Invoice for{' '}
              {sharableLinkMeta?.totalFormatted}
            </h1>
            <Group spacing={10}>
              <Text className={clsx(Classes.TEXT_MUTED, styles.invoiceDueDate)}>
                Invoice due {sharableLinkMeta?.dueDateFormatted}{' '}
              </Text>
            </Group>
          </Stack>

          <Stack className={styles.address} spacing={2}>
            <Box className={styles.customerName}>
              {sharableLinkMeta?.customerName}
            </Box>

            {sharableLinkMeta?.formattedCustomerAddress && (
              <Box
                dangerouslySetInnerHTML={{
                  __html: sharableLinkMeta?.formattedCustomerAddress,
                }}
              />
            )}
          </Stack>

          <h2 className={styles.invoiceNumber}>
            Invoice {sharableLinkMeta?.invoiceNo}
          </h2>

          <Stack spacing={0} className={styles.totals}>
            <Group
              position={'apart'}
              className={clsx(styles.totalItem, styles.borderBottomGray)}
            >
              <Text>Sub Total</Text>
              <Text>{sharableLinkMeta?.subtotalFormatted}</Text>
            </Group>

            <Group position={'apart'} className={styles.totalItem}>
              <Text>Total</Text>
              <Text style={{ fontWeight: 500 }}>
                {sharableLinkMeta?.totalFormatted}
              </Text>
            </Group>

            {sharableLinkMeta?.taxes?.map((tax, key) => (
              <Group key={key} position={'apart'} className={styles.totalItem}>
                <Text>{tax?.name}</Text>
                <Text>{tax?.taxRateAmountFormatted}</Text>
              </Group>
            ))}
            <Group
              position={'apart'}
              className={clsx(styles.totalItem, styles.borderBottomGray)}
            >
              <Text>Paid Amount (-)</Text>
              <Text>{sharableLinkMeta?.paymentAmountFormatted}</Text>
            </Group>

            <Group
              position={'apart'}
              className={clsx(styles.totalItem, styles.borderBottomDark)}
            >
              <Text>Due Amount</Text>
              <Text style={{ fontWeight: 500 }}>
                {sharableLinkMeta?.dueAmountFormatted}
              </Text>
            </Group>
          </Stack>
        </Stack>

        <Stack spacing={8} className={styles.footerButtons}>
          <Button
            minimal
            className={clsx(styles.footerButton, styles.downloadInvoiceButton)}
          >
            Download Invoice
          </Button>

          <Button
            onClick={handleInvoicePreviewBtnClick}
            className={clsx(styles.footerButton, styles.viewInvoiceButton)}
          >
            View Invoice
          </Button>

          {sharableLinkMeta?.isReceivable &&
            sharableLinkMeta?.hasStripePaymentMethod && (
              <Button
                intent={Intent.PRIMARY}
                className={clsx(styles.footerButton, styles.buyButton)}
                loading={isStripeCheckoutLoading}
                onClick={handlePayButtonClick}
              >
                Pay {sharableLinkMeta?.totalFormatted}
              </Button>
            )}
        </Stack>

        <Text className={clsx(Classes.TEXT_MUTED, styles.buyNote)}>
          By confirming your payment, you allow Bigcapital Technology, Inc. to
          charge you for this payment and save your payment information in
          accordance with their terms.
        </Text>
      </Stack>

      <Stack spacing={18} className={styles.footer}>
        <Box
          dangerouslySetInnerHTML={{
            __html: sharableLinkMeta?.organization?.addressTextFormatted || '',
          }}
        ></Box>

        <Stack spacing={0} className={styles.footerText}>
          © 2024 Bigcapital Technology, Inc.
          <br />
          All rights reserved.
        </Stack>
      </Stack>
    </Box>
  );
}
