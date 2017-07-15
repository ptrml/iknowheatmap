import { D3angularPage } from './app.po';

describe('d3angular App', () => {
  let page: D3angularPage;

  beforeEach(() => {
    page = new D3angularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
