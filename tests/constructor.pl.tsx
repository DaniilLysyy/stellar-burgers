import { test, expect } from '@playwright/test';
test.describe('Конструктор бургера и оформление заказа', () => {

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/**',
      update: false,
      notFound: 'abort'
    });

    await page.goto('/');
  });

  test('моковые ингредиенты загружаются', async ({ page }) => {
    await expect(page.getByText('Тестовая булка')).toBeVisible();
    await expect(page.getByText('Тестовая начинка')).toBeVisible();
  });

  test('булка и начинка добавляются в конструктор', async ({ page }) => {
    const bun = page
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая булка' });

    const main = page
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая начинка' });

    await bun.getByRole('button', { name: 'Добавить' }).click();

    await main.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText('Тестовая булка (верх)')).toBeVisible();
    await expect(page.getByText('Тестовая булка (низ)')).toBeVisible();

    await expect(
      page.getByText('Тестовая начинка', { exact: true })
    ).toHaveCount(2);
  });

  test('модальное окно ингредиента открывается и закрывается', async ({
    page
  }) => {
    const ingredient = page
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая булка' });

    await ingredient.getByRole('link').click();

    await expect(page).toHaveURL(/\/ingredients\/test-bun-1$/);

    const modal = page.getByRole('dialog');

    await expect(modal).toBeVisible();

    await expect(
      modal.getByText('Тестовая булка', { exact: true })
    ).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modal).not.toBeVisible();
    await expect(page).toHaveURL('http://localhost:4000/');
  });

  test('модальное окно ингредиента закрывается по оверлею', async ({
    page
  }) => {
    const ingredient = page
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая булка' });

    await ingredient.getByRole('link').click();

    const modal = page.getByRole('dialog');

    await expect(modal).toBeVisible();
    await expect(page).toHaveURL(/\/ingredients\/test-bun-1$/);

    await page.mouse.click(10, 300);

    await expect(modal).not.toBeVisible();
    await expect(page).toHaveURL('http://localhost:4000/');
  });

  test('авторизованный пользователь может оформить заказ', async ({
    page
  }) => {

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');

      document.cookie =
        'accessToken=test-access-token; path=/';
    });

    await page.reload();

    const bun = page
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая булка' });

    const main = page
      .getByRole('listitem')
      .filter({ hasText: 'Тестовая начинка' });

    await bun.getByRole('button', { name: 'Добавить' }).click();
    await main.getByRole('button', { name: 'Добавить' }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByRole('dialog');

    await expect(modal).toBeVisible();
    await expect(modal.getByText('123456')).toBeVisible();

    await expect(page.getByText('Тестовая булка (верх)')).toHaveCount(0);
    await expect(page.getByText('Тестовая булка (низ)')).toHaveCount(0);

    await expect(
      page.getByText('Тестовая начинка', { exact: true })
    ).toHaveCount(1);

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modal).not.toBeVisible();
  });

});