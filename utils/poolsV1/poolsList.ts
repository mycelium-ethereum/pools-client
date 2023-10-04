import { NETWORKS } from "@tracer-protocol/pools-js";

export const poolsLists = {
  [NETWORKS.ARBITRUM as string]: {
    "name": "Tracer DAO Verified",
    "timestamp": "",
    "pools": [
      {
        "name": "1-BTC/USDC",
        "address": "0x146808f54DB24Be2902CA9f595AD8f27f56B2E76",
        "leverage": 1,
        "updateInterval": 3600,
        "frontRunningInterval": 300,
        "keeper": "0x759E817F0C40B11C775d1071d466B5ff5c6ce28e",
        "committer": {
          "address": "0x539Bf88D729B65F8eC25896cFc7a5f44bbf1816b"
        },
        "longToken": {
          "name": "1-LONG-BTC/USD",
          "address": "0x1616bF7bbd60E57f961E83A602B6b9Abb6E6CAFc",
          "symbol": "1L-BTC/USD",
          "decimals": 6
        },
        "shortToken": {
          "name": "1-SHORT-BTC/USD",
          "address": "0x052814194f459aF30EdB6a506eABFc85a4D99501",
          "symbol": "1S-BTC/USD",
          "decimals": 6
        },
        "settlementToken": {
          "name": "USDC",
          "symbol": "USDC",
          "decimals": 6,
          "address": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
        }
      },
      {
        "name": "3-BTC/USDC",
        "address": "0x70988060e1FD9bbD795CA097A09eA1539896Ff5D",
        "leverage": 3,
        "updateInterval": 3600,
        "frontRunningInterval": 300,
        "keeper": "0x759E817F0C40B11C775d1071d466B5ff5c6ce28e",
        "committer": {
          "address": "0xFDE5D7B7596AF6aC5df7C56d76E14518A9F578dF"
        },
        "longToken": {
          "name": "3-LONG-BTC/USD",
          "address": "0x05A131B3Cd23Be0b4F7B274B3d237E73650e543d",
          "symbol": "3L-BTC/USD",
          "decimals": 6
        },
        "shortToken": {
          "name": "3-SHORT-BTC/USD",
          "address": "0x85700dC0bfD128DD0e7B9eD38496A60baC698fc8",
          "symbol": "3S-BTC/USD",
          "decimals": 6
        },
        "settlementToken": {
          "name": "USDC",
          "symbol": "USDC",
          "decimals": 6,
          "address": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
        }
      },
      {
        "name": "1-ETH/USDC",
        "address": "0x3A52aD74006D927e3471746D4EAC73c9366974Ee",
        "leverage": 1,
        "updateInterval": 3600,
        "frontRunningInterval": 300,
        "keeper": "0x759E817F0C40B11C775d1071d466B5ff5c6ce28e",
        "committer": {
          "address": "0x047Cd47925C2390ce26dDeB302b8b165d246d450"
        },
        "longToken": {
          "name": "1-LONG-ETH/USD",
          "address": "0x38c0a5443c7427e65A9Bf15AE746a28BB9a052cc",
          "symbol": "1L-ETH/USD",
          "decimals": 6
        },
        "shortToken": {
          "name": "1-SHORT-ETH/USD",
          "address": "0xf581571DBcCeD3A59AaaCbf90448E7B3E1704dcD",
          "symbol": "1S-ETH/USD",
          "decimals": 6
        },
        "settlementToken": {
          "name": "USDC",
          "symbol": "USDC",
          "decimals": 6,
          "address": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
        }
      },
      {
        "name": "3-ETH/USDC",
        "address": "0x54114e9e1eEf979070091186D7102805819e916B",
        "leverage": 3,
        "updateInterval": 3600,
        "frontRunningInterval": 300,
        "keeper": "0x759E817F0C40B11C775d1071d466B5ff5c6ce28e",
        "committer": {
          "address": "0x72c4e7Aa6c743DA4e690Fa7FA66904BC3f2C9C04"
        },
        "longToken": {
          "name": "3-LONG-ETH/USD",
          "address": "0xaA846004Dc01b532B63FEaa0b7A0cB0990f19ED9",
          "symbol": "3L-ETH/USD",
          "decimals": 6
        },
        "shortToken": {
          "name": "3-SHORT-ETH/USD",
          "address": "0x7d7E4f49a29dDA8b1eCDcf8a8bc85EdcB234E997",
          "symbol": "3S-ETH/USD",
          "decimals": 6
        },
        "settlementToken": {
          "name": "USDC",
          "symbol": "USDC",
          "decimals": 6,
          "address": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
        }
      },
      // {
      //   "name": "3-TOKE/USD",ß
      //   "address": "0xc11B9Dc0F566B5084FC48Be1F821a8298fc900bC",
      //   "leverage": 3,
      //   "updateInterval": 3600,
      //   "frontRunningInterval": 300,
      //   "keeper": "0x759E817F0C40B11C775d1071d466B5ff5c6ce28e",
      //   "committer": {
      //     "address": "0xb913D14B3a3bB1D06B2dB1Fd141f2432bB25F5F2"
      //   },
      //   "longToken": {
      //     "name": "3L-TOKE/USD",
      //     "address": "0xCB78B42e374AB268B01336cE31C7ba329C1d4beC",
      //     "symbol": "3L-TOKE/USD",
      //     "decimals": 6
      //   },
      //   "shortToken": {
      //     "name": "3S-TOKE/USD",
      //     "address": "0x16cd57B7Cf7c0954878C254b2318676007DF2af3",
      //     "symbol": "3S-TOKE/USD",
      //     "decimals": 6
      //   },
      //   "settlementToken": {
      //     "name": "USDC",
      //     "symbol": "USDC",
      //     "decimals": 6,
      //     "address": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
      //   }
      // },
      // {
      //   "name": "3-LINK/USD",
      //   "address": "0x7b6FfAd58ce09f2a71c01e61F94b1592Bd641876",
      //   "leverage": 3,
      //   "updateInterval": 3600,
      //   "frontRunningInterval": 300,
      //   "keeper": "0x759E817F0C40B11C775d1071d466B5ff5c6ce28e",
      //   "committer": {
      //     "address": "0x8186948382f67c7160Fc7b872688AdC293aDF789"
      //   },
      //   "longToken": {
      //     "name": "3L-LINK/USD",
      //     "address": "0x9d6CCCb49Abd383C51079904e341cAb1d02d92c6",
      //     "symbol": "3L-LINK/USD",
      //     "decimals": 6
      //   },
      //   "shortToken": {
      //     "name": "3S-LINK/USD",
      //     "address": "0x6d3bED2465d8c5e3Ef7F8DDC2CD3f8b38E90EaA5",
      //     "symbol": "3S-LINK/USD",
      //     "decimals": 6
      //   },
      //   "settlementToken": {
      //     "name": "USDC",
      //     "symbol": "USDC",
      //     "decimals": 6,
      //     "address": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
      //   }
      // },
      // {
      //   "name": "3-AAVE/USD",
      //   "address": "0x23A5744eBC353944A4d5baaC177C16b199AfA4ed",
      //   "leverage": 3,
      //   "updateInterval": 3600,
      //   "frontRunningInterval": 300,
      //   "keeper": "0x759E817F0C40B11C775d1071d466B5ff5c6ce28e",
      //   "committer": {
      //     "address": "0x993321599Fc9D0c5a496044308f16C70575DABBa"
      //   },
      //   "longToken": {
      //     "name": "3L-AAVE/USD",
      //     "address": "0xd15239e444Ac687874fee8A415f8F59fd01E3E51",
      //     "symbol": "3L-AAVE/USD",
      //     "decimals": 18
      //   },
      //   "shortToken": {
      //     "name": "3S-AAVE/USD",
      //     "address": "0x4eBA8B7B13C565041D74b92dCA6C9E4B8885B3cC",
      //     "symbol": "3S-AAVE/USD",
      //     "decimals": 18
      //   },
      //   "settlementToken": {
      //     "name": "Frax",
      //     "symbol": "FRAX",
      //     "decimals": 18,
      //     "address": "0x17fc002b466eec40dae837fc4be5c67993ddbd6f"
      //   }
      // },
      // {
      //   "name": "1-EUR/USD",
      //   "address": "0x2C740EEe739098Ab8E90f5Af78ac1d07835d225B",
      //   "leverage": 1,
      //   "updateInterval": 3600,
      //   "frontRunningInterval": 300,
      //   "keeper": "0x759E817F0C40B11C775d1071d466B5ff5c6ce28e",
      //   "committer": {
      //     "address": "0xb894D3775862FFdE084eD31f9e42388e592E3137"
      //   },
      //   "longToken": {
      //     "name": "1L-EUR/USD",
      //     "address": "0x6F680d315545309307F42840b234412090C0bBe8",
      //     "symbol": "1L-EUR/USD",
      //     "decimals": 6
      //   },
      //   "shortToken": {
      //     "name": "1S-EUR/USD",
      //     "address": "0x7C5C24C5F3DbF4A99DDa5127D44e55b9a797eC4d",
      //     "symbol": "1S-EUR/USD",
      //     "decimals": 6
      //   },
      //   "settlementToken": {
      //     "name": "USDC",
      //     "symbol": "USDC",
      //     "decimals": 6,
      //     "address": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
      //   }
      // },
      // {
      //   "name": "3-EUR/USD",
      //   "address": "0xA45B53547EC002403531D453c118AC41c03B3346",
      //   "leverage": 3,
      //   "updateInterval": 3600,
      //   "frontRunningInterval": 300,
      //   "keeper": "0x759E817F0C40B11C775d1071d466B5ff5c6ce28e",
      //   "committer": {
      //     "address": "0x149BDeAC3E90522D8043452910Ef41f7cb75E3f3"
      //   },
      //   "longToken": {
      //     "name": "3L-EUR/USD",
      //     "address": "0x316C96E328071DC6403587c243130712A9D03fF3",
      //     "symbol": "3L-EUR/USD",
      //     "decimals": 6
      //   },
      //   "shortToken": {
      //     "name": "3S-EUR/USD",
      //     "address": "0xA8C483D29bFaD4Ea159C1a002f4769C33F808A1e",
      //     "symbol": "3S-EUR/USD",
      //     "decimals": 6
      //   },
      //   "settlementToken": {
      //     "name": "USDC",
      //     "symbol": "USDC",
      //     "decimals": 6,
      //     "address": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
      //   }
      // }
    ]
  }
};