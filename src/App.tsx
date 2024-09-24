import { useState } from "react";
import Header from "./components/Header";
import { Reclaim } from "@reclaimprotocol/js-sdk";
import QRCode from "react-qr-code";
import { Button } from "./components/Button";
import VerifyProof from "./verify-proof";
import { ClipLoader } from "react-spinners";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

function App() {
  const [url, setUrl] = useState("");
  const [ready, setReady] = useState(false);
  const [proof, setProof] = useState({});
  const [loading, setLoading] = useState(false);
  const { account, connected } = useWallet();

  const APP_ID = "0x408edDD2dF298C2F5df1E2eDE2eBF1278A96Ee45"; //TODO: replace with your applicationId
  const reclaimClient = new Reclaim.ProofRequest(APP_ID);

  async function generateVerificationRequest() {
    setLoading(true);
    const providerId = "1bba104c-f7e3-4b58-8b42-f8c0346cdeab"; //TODO: replace with your provider ids you had selected while creating the application

    reclaimClient.addContext(
      `user's address`,
      "for acmecorp.com on 1st january"
    );

    await reclaimClient.buildProofRequest(providerId, true, "V2Linking");

    reclaimClient.setSignature(
      await reclaimClient.generateSignature(
        "0x5bdaf747ad9333898a0d9cb613f499d0b00164d7b8230628cf7ffa30fd323372" //TODO : replace with your APP_SECRET
      )
    );

    const { requestUrl } = await reclaimClient.createVerificationRequest();

    setUrl(requestUrl);
    setLoading(false);

    await reclaimClient.startSession({
      onSuccessCallback: (proofs) => {
        console.log("Verification success", proofs);
        setProof(proofs[0]);
        setReady(true);
      },
      onFailureCallback: (error) => {
        console.error("Verification failed", error);
        setLoading(false);
      },
    });
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-12">
      <Header />

      {!connected && (
        <p className="text-red-500 font-semibold text-xl">
          Please connect your wallet to create a claim QR code.
        </p>
      )}

      <div className="flex flex-row gap-12">
        {account && !url && !loading && (
          <Button onClick={generateVerificationRequest}>
            Create Claim QrCode
          </Button>
        )}
        {loading && <ClipLoader color="#4A90E2" size={50} />}{" "}
        {url && !ready && <QRCode value={url} />}
        {ready && <VerifyProof proof={proof} />}{" "}
      </div>
    </main>
  );
}

export default App;
