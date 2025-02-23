import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    // Selectors
    private readonly firstNameInput = '[data-test="firstName"]';
    private readonly lastNameInput = '[data-test="lastName"]';
    private readonly postalCodeInput = '[data-test="postalCode"]';
    private readonly continueButton = '[data-test="continue"]';
    private readonly finishButton = '[data-test="finish"]';
    private readonly completeHeader = '[data-test="complete-header"]';
    private readonly completeText = '[data-test="complete-text"]';
    private readonly backToProductsButton = '[data-test="back-to-products"]';
    private readonly cartItemQuantity = '[data-test="item-quantity"]';
    private readonly paymentInfo = '[data-test="payment-info-value"]';
    private readonly shippingInfo = '[data-test="shipping-info-value"]';
    private readonly subtotalLabel = '[data-test="subtotal-label"]';
    private readonly taxLabel = '[data-test="tax-label"]';
    private readonly totalLabel = '[data-test="total-label"]';
    private readonly errorMessage = '[data-test="error"]';
    private readonly cancelButton = '[data-test="cancel"]';

    constructor(page: Page) {
        super(page);
    }

    async fillShippingDetails(firstName?: string, lastName?: string, postalCode?: string) {
        if (firstName) await this.page.locator(this.firstNameInput).fill(firstName);
        if (lastName) await this.page.locator(this.lastNameInput).fill(lastName);
        if (postalCode) await this.page.locator(this.postalCodeInput).fill(postalCode);
        await this.page.locator(this.continueButton).click();
    }

    async verifyOrderSummary() {
        // Verify payment and shipping info are present
        await this.page.locator(this.paymentInfo).isVisible();
        await this.page.locator(this.shippingInfo).isVisible();
        
        // Verify price breakdown is visible
        await this.page.locator(this.subtotalLabel).isVisible();
        await this.page.locator(this.taxLabel).isVisible();
        await this.page.locator(this.totalLabel).isVisible();
    }

    async completeOrder() {
        await this.page.locator(this.finishButton).click();
    }

    async verifyOrderConfirmation() {
        await this.page.locator(this.completeHeader).isVisible();
        await this.page.locator(this.completeText).isVisible();
    }

    async returnToProducts() {
        await this.page.locator(this.backToProductsButton).click();
    }

    async cancelCheckout() {
        await this.page.locator(this.cancelButton).click();
    }

    async getErrorMessage(): Promise<string | null> {
        const error = this.page.locator(this.errorMessage);
        if (await error.isVisible()) {
            return error.textContent();
        }
        return null;
    }
}
