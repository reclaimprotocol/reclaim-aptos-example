import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";

const wallets = [new PetraWallet()];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      optInWallets={["Petra"]}
    >
      <App />
    </AptosWalletAdapterProvider>
  </StrictMode>
);
