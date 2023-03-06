import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { EnrichedTransaction, Source, TokenTransfer } from "helius-sdk";
import {
    ProtonAccount,
    ProtonTransaction,
    ProtonTransactionAction,
    SOL,
} from "../types";
import { traverseAccountData } from "../utils/account-data";

import { traverseNativeTransfers } from "../utils/native-transfers";
import { traverseTokenTransfers } from "../utils/token-transfers";

export const parseUnknown = (
    transaction: EnrichedTransaction,
    address: string | undefined
): ProtonTransaction => {
    const {
        signature,
        timestamp,
        type,
        source,
        accountData,
        tokenTransfers,
        nativeTransfers,
    } = transaction;

    const fee = transaction.fee / LAMPORTS_PER_SOL;

    if (tokenTransfers === null || nativeTransfers === null) {
        return {
            accounts: [],
            actions: [],
            fee,
            primaryUser: "",
            signature,
            source,
            timestamp,
            type,
        };
    }

    const primaryUser =
        tokenTransfers[0]?.fromUserAccount ||
        nativeTransfers[0]?.fromUserAccount ||
        "";

    const actions: ProtonTransactionAction[] = [];
    const accounts: ProtonAccount[] = [];

    if (
        transaction.instructions &&
        transaction?.instructions?.programId ===
            "xnft5aaToUM4UFETUQfj7NUDUBdvYHTVhNFThEYTm55"
    ) {
    }

    traverseTokenTransfers(tokenTransfers, actions, address);
    traverseNativeTransfers(nativeTransfers, actions, address);
    traverseAccountData(accountData, accounts);

    return {
        accounts,
        actions,
        fee,
        primaryUser,
        signature,
        source,
        timestamp,
        type,
    };
};
