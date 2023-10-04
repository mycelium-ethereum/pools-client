const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint128",
        name: "commitID",
        type: "uint128",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "enum IPoolCommitter.CommitType",
        name: "commitType",
        type: "uint8",
      },
    ],
    name: "CreateCommit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint128",
        name: "commitID",
        type: "uint128",
      },
    ],
    name: "ExecuteCommit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint128",
        name: "commitID",
        type: "uint128",
      },
    ],
    name: "FailedCommitExecution",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint128",
        name: "commitID",
        type: "uint128",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "enum IPoolCommitter.CommitType",
        name: "commitType",
        type: "uint8",
      },
    ],
    name: "RemoveCommit",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "enum IPoolCommitter.CommitType",
        name: "commitType",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "commit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "executeAllCommitments",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "enum IPoolCommitter.CommitType",
            name: "commitType",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "created",
            type: "uint40",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        internalType: "struct IPoolCommitter.Commit",
        name: "_commit",
        type: "tuple",
      },
    ],
    name: "executeCommitment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "_commitID",
        type: "uint128",
      },
    ],
    name: "getCommit",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "enum IPoolCommitter.CommitType",
            name: "commitType",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "created",
            type: "uint40",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        internalType: "struct IPoolCommitter.Commit",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "_maximumCommitQueueLength",
        type: "uint128",
      },
    ],
    name: "setMaxCommitQueueLength",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "_minimumCommitSize",
        type: "uint128",
      },
    ],
    name: "setMinimumCommitSize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "quoteToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "leveragedPool",
        type: "address",
      },
    ],
    name: "setQuoteAndPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "governance",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
export default abi;