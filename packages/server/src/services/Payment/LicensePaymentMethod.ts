import { License } from '@/system/models';
import PaymentMethod from '@/services/Payment/PaymentMethod';
import { Plan } from '@/system/models';
import { IPaymentMethod, ILicensePaymentModel } from '@/interfaces';
import {
  PaymentInputInvalid,
  PaymentAmountInvalidWithPlan,
  VoucherCodeRequired,
} from '@/exceptions';

export default class LicensePaymentMethod
  extends PaymentMethod
  implements IPaymentMethod
{
  /**
   * Payment subscription of organization via license code.
   * @param {ILicensePaymentModel} licensePaymentModel -
   */
  public async payment(licensePaymentModel: ILicensePaymentModel, plan: Plan) {
    this.validateLicensePaymentModel(licensePaymentModel);

    const license = await this.getLicenseOrThrowInvalid(licensePaymentModel);
    this.validatePaymentAmountWithPlan(license, plan);

    // Mark the license code as used.
    return License.markLicenseAsUsed(licensePaymentModel.licenseCode);
  }

  /**
   * Validates the license code activation on the storage.
   * @param {ILicensePaymentModel} licensePaymentModel -
   */
  private async getLicenseOrThrowInvalid(
    licensePaymentModel: ILicensePaymentModel
  ) {
    const foundLicense = await License.query()
      .modify('filterActiveLicense')
      .where('license_code', licensePaymentModel.licenseCode)
      .first();

    if (!foundLicense) {
      throw new PaymentInputInvalid();
    }
    return foundLicense;
  }

  /**
   * Validates the payment amount with given plan price.
   * @param {License} license
   * @param {Plan} plan
   */
  private validatePaymentAmountWithPlan(license: License, plan: Plan) {
    if (license.planId !== plan.id) {
      throw new PaymentAmountInvalidWithPlan();
    }
  }

  /**
   * Validate voucher payload.
   * @param {ILicensePaymentModel} licenseModel -
   */
  private validateLicensePaymentModel(licenseModel: ILicensePaymentModel) {
    if (!licenseModel || !licenseModel.licenseCode) {
      throw new VoucherCodeRequired();
    }
  }
}
