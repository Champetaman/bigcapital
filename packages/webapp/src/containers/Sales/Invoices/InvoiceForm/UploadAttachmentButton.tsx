// @ts-nocheck
import clsx from 'classnames';
import { Field, useFormikContext } from 'formik';
import {
  Button,
  Classes,
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import { FFormGroup } from '@/components';
import { UploadAttachmentsPopoverContent } from './UploadAttachmentsPopoverContent';
import styles from './UploadAttachmentButton.module.scss';

function UploadAttachmentButtonButtonContentField() {
  return (
    <Field name={'attachments'}>
      {({ form: { setFieldValue }, field: { value } }) => (
        <UploadAttachmentsPopoverContent
          value={value}
          onChange={(value) => {
            setFieldValue('attachments', value);
          }}
        />
      )}
    </Field>
  );
}

export function UploadAttachmentButton() {
  const { values } = useFormikContext();
  const uploadedFiles = values?.attachments?.length || 0;

  return (
    <FFormGroup
      name={'attachments'}
      label={'Attachments'}
      className={styles.attachmentField}
    >
      <Popover
        interactionKind={PopoverInteractionKind.CLICK}
        popoverClassName={clsx(styles.popover, Classes.POPOVER_CONTENT_SIZING)}
        placement={'top-start'}
        content={<UploadAttachmentButtonButtonContentField />}
      >
        <Button className={styles.attachmentButton}>
          {uploadedFiles > 0 ? (
            <>Upload attachments ({uploadedFiles})</>
          ) : (
            <>Upload attachments</>
          )}
        </Button>
      </Popover>
    </FFormGroup>
  );
}
