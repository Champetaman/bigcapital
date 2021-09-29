import React from 'react';
import { Field } from 'formik';
import classNames from 'classnames';
import { Classes, FormGroup } from '@blueprintjs/core';

import FinancialStatementDateRange from '../FinancialStatementDateRange';
import {
  Row,
  Col,
  ContactsMultiSelect,
  FormattedMessage as T,
} from '../../../components';
import {
  VendorsTransactionsGeneralPanelProvider,
  useVendorsTransactionsGeneralPanelContext,
} from './VendorsTransactionsHeaderGeneralPanelProvider';

/**
 * Vendors transactions header - General panel
 */
export default function VendorsTransactionsHeaderGeneralPanel() {
  return (
    <VendorsTransactionsGeneralPanelProvider>
      <VendorsTransactionsHeaderGeneralPanelContent />
    </VendorsTransactionsGeneralPanelProvider>
  );
}

/**
 * Vendors transactions header - General panel - Content.
 */
function VendorsTransactionsHeaderGeneralPanelContent() {
  const { vendors } = useVendorsTransactionsGeneralPanelContext();

  return (
    <div>
      <FinancialStatementDateRange />

      <Row>
        <Col xs={5}>
          <Field name={'vendorsIds'}>
            {({ form: { setFieldValue }, field: { value } }) => (
              <FormGroup
                label={<T id={'specific_vendors'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
              >
                <ContactsMultiSelect
                  items={vendors}
                  onItemSelect={(vendors) => {
                    const vendorsIds = vendors.map((customer) => customer.id);
                    setFieldValue('vendorsIds', vendorsIds);
                  }}
                />
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
    </div>
  );
}