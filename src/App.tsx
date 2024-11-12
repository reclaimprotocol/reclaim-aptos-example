import { useState, useEffect } from "react";
import Header from "./components/Header";
import { ReclaimProofRequest, Proof } from "@reclaimprotocol/js-sdk";
import QRCode from "react-qr-code";
import { Button } from "./components/Button";
import VerifyProof from "./verify-proof";
import { ClipLoader } from "react-spinners";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

function App() {
  const [ready, setReady] = useState(false);
  const [proof, setProof] = useState({});
  const [loading, setLoading] = useState(false);
  const { account, connected } = useWallet();
  const [reclaimProofRequest, setReclaimProofRequest] = useState(null);
  const [requestUrl, setRequestUrl] = useState("");
  const [statusUrl, setStatusUrl] = useState("");

  useEffect(() => {
    async function initializeReclaim() {
      const APP_ID = "0x6E0338a6D8594101Ea9e13840449242015d71B19"; // This is an example App Id Replace it with your App Id.
      const APP_SECRET =
        "0x1e0d6a6548b72286d747b4ac9f2ad6b07eba8ad6a99cb1191890ea3f77fae48f"; // This is an example App Secret Replace it with your App Secret.
      const PROVIDER_ID = "6d3f6753-7ee6-49ee-a545-62f1b1822ae5"; // This is GitHub Provider Id Replace it with the provider id you want to use.

      const proofRequest = await ReclaimProofRequest.init(
        APP_ID,
        APP_SECRET,
        PROVIDER_ID
      );
      // @ts-ignore
      setReclaimProofRequest(proofRequest);
    }

    initializeReclaim();
  }, []);

  async function generateVerificationRequest() {
    setLoading(true);
    if (!reclaimProofRequest) {
      console.error("Reclaim Proof Request not initialized");
      return;
    }
    // @ts-ignore
    reclaimProofRequest.addContext(
      `user's address`,
      "for acmecorp.com on 1st january"
    );
    // @ts-ignore
    const url = await reclaimProofRequest.getRequestUrl();
    setRequestUrl(url);
    // @ts-ignore
    const status = reclaimProofRequest.getStatusUrl();
    setStatusUrl(status);

    setLoading(false);
    // @ts-ignore
    await reclaimProofRequest.startSession({
      onSuccessCallback: (proof: Proof) => {
        console.log("Verification success", proof);
        setProof(proof);
        setReady(true);
      },
      onFailureCallback: (error: Error) => {
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
        {account && !requestUrl && !loading && (
          <Button onClick={generateVerificationRequest}>
            Create Claim QrCode
          </Button>
        )}
        {loading && <ClipLoader color="#4A90E2" size={50} />}{" "}
        {requestUrl && !ready && <QRCode value={requestUrl} />}
        {ready && <VerifyProof proof={proof} />}{" "}
      </div>
    </main>
  );
}

export default App;
