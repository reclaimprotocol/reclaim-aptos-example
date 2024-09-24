export interface ClaimInfo {
  context: string;
  parameters: string;
  provider: string;
}

export interface CompleteClaimData {
  epoch: string;
  identifier: string;
  owner: string;
  timestampS: string;
}

export interface SignedClaim {
  claim: CompleteClaimData;
  signatures: string[];
}

export interface Proof {
  claimInfo: ClaimInfo;
  signedClaim: SignedClaim;
}
