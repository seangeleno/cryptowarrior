import * as PubSub from "pubsub-js";
import {PriceHistory} from "./types/PriceHistory";
import {IAdapter, ISource, IStreamingSource} from "./sources/Interfaces";
import {Ticker} from "./types/Ticker";
import {GdaxApi} from "./sources/gdax/GdaxApi";
import {GdaxPriceHistoryAdapter, GdaxPriceHistorySource} from "./sources/gdax/GdaxPriceHistorySource";
import {GdaxTickerSource} from "./sources/gdax/GdaxTickerSource";
import {MockLivePriceSource, MockPriceHistorySource, MockTickerSource} from "./sources/mock/MockSources";
import {LivePrice} from "./types/LivePrice";
import {GdaxLivePriceSource} from "./sources/gdax/GdaxLivePriceSource";
import {ScreenInventory} from "./layouts/ScreenInventory";

/**
 * Simple IoC Container
 *
 * Note: Would love to use the Angular style one where $args are auto-injected. Don't love the existing
 *       solutions on npm
 */
export default class Container {

    public eventHub: PubSubJS.Base;
    public tickers: string[]; // hack around api/live price source not handling single vs multiple subscribes well
    public gdaxApi: GdaxApi;
    public gdaxPriceHistoryAdapter: IAdapter<PriceHistory>;

    public livePriceSource: IStreamingSource<LivePrice>;
    public priceHistorySource: ISource<PriceHistory>;
    public tickerSource: ISource<Ticker[]>;

    public screenInventory: ScreenInventory;

    public source: string;

    constructor(private argv) {
        this.eventHub = PubSub;

        this.tickers = ["BTC-USD", "ETH-USD", "LTC-USD"];
        this.gdaxApi = new GdaxApi();
        this.gdaxPriceHistoryAdapter = new GdaxPriceHistoryAdapter();

        this.screenInventory = new ScreenInventory();

        switch (argv.source) {
            case "mock":
                this.initMock();
                this.source = "Mock";
                break;
            default:
                this.initGdax();
                this.source = "GDAX";
                break;
        }
    }

    private initGdax() {
        this.priceHistorySource = new GdaxPriceHistorySource(this.gdaxApi, this.gdaxPriceHistoryAdapter);
        this.livePriceSource = new GdaxLivePriceSource(this.tickers);
        this.tickerSource = new GdaxTickerSource(this.gdaxApi);
    }

    private initMock() {
        this.priceHistorySource = new MockPriceHistorySource();
        this.livePriceSource = new MockLivePriceSource();
        this.tickerSource = new MockTickerSource();
    }
}
