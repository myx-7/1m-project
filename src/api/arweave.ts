import Arweave from 'arweave';

// API Response types for Arweave upload
export interface ArweaveUploadResponse {
  success: boolean;
  url?: string;
  txId?: string;
  contentType?: string;
  error?: string;
  details?: string;
}

// Arweave configuration
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

// Arweave wallet key - In production, this should be loaded from environment variables
// For security reasons, consider using a server-side proxy for production deployments
const getArweaveKey = () => {
  const keyData = import.meta.env.VITE_ARWEAVE_KEY;
  
  if (!keyData) {
    // Default key from your example (should be replaced with environment variable)
    return {
        d: "bRw51I_JUbzYAlBnnEizYmrIAXmYlzonLR1OWZN42q2DU4jv-56arM0e-Ijz7Gb_p43WMhxopudsXH1jsYHDwKz_2N7o9T9xHd_CMHrVsXlmpnr9gUJvvbzPEQqDAxpaYw0QxW9Q_oBiJ-nni6qYhFqq-b9a5DcnGLgH7OzIwUYxGpE5iPyUNVMltGOgogdeqOdShg9mBRCJg119mykKrIX9VRAXEoWiLLu-reB5r7CrDvoThqUm8VxLJ0wy4qXYzz1fMc77yY-I0j-kiVW9pItACmxjTHHMTAT-8x__HIGGuoqL1U5kJAEOYbq6ZrLgt01yv7dIT2jvhwAiFiZ3N27YZJjLNGBewSI1l599tMi3No_lf8fjNwcRe6OlVubN4l5yJBt21gqffIYwLczYCTth0kQjhemd2RaED3tynfj533S8Qricdf3OaYK2Y52BxOMCyEtFmoXza1KECjdnVdnKIyo2BKVl09rcUzYhWtHb3lcwIvijEkSEndsTFeGouh2baSLAKUI131xFq8mOIPjX5i6g1O8y7ea82gXBD4J0hCvF8ZUTDspjaDwuRI1xtARWG203giLOTh8Zr33ZE6UivHEke5QQwLE9GZUJBdMeOm473TCqtK2DG4pAKPPqS_2UETZOZBtHK4FskZQwHKwZF_9xJd3SxSmoat1UzgE",
        dp: "frsG7JujHtptVQe4EWM403f0PCjCwH_MQWby1n1Prg4swCaczq0Qg0VIrWm3KByPVuZSX6osxvss58l15-iV_pGN-__rOBPSXVXFmpm-p4Mzr84OXwnFvkv7-ICExDYM2bI4PJOHb9g40R_ObAulsRfJTThrI7PjHuuk_Ull80e3iWg9IiTC8ZeNaH_6Wzm7C7BW3d4oEfI4dxk_R3jKElx-mEvLTo3hMoxgZYxawL-hHo3xwwSpQdPpMz-BqZN-6oE5bkRgASUkuFEvhjhWV30BNrDYmV_6eplU-cfPbji-oz-SYaJBl4AQjLc-UPh_jvSN0IK3PPajcbY6g1Vk_Q",
        dq: "ZCnfxtOF87eilUqTaSybR_HtPqUb_L4U9niA9thmF0d668FSGKb0_8r_Rhmup8-ts5b0Kb0y__MS3mmw6bqCJ_qmQnzizmRNNYW7TY7ekcUJum75e11byvnBULdE_PhvY4xoLJXVPOXiG-S6Mtfj5LYnlaWFTkbLi5w-axzMzIxeE1cdVYJcXGWDOWLzMwE4qc0c2TYus4wssOhRvrI-g0f-RybN8dpKY73eNx7wutkFmi-eaet_78XwseVhbVySi_UDGE3A-Mq0aDBgs1LIR8eXp-IvKxTSFyPSVtAHqBhOuCzrZwfFr-RQs7PXU5Q3tsUkKXlg1vEXV5Phja_N4Q",
        e: "AQAB",
        kty: "RSA",
        n: "pvrsotlkxgbZZrpI3QrzGzNgiJgLMhZ3sr5oGvvCGuo6cl8wqfTxSmmRwKIZ21Yz1QoTzHYwUlpPgZzQmaRmvWLax8y-dWjR1YmvRm0rpBPY-aY2BK-1x1suO4zE7Gyj7IhR_BQ4Ur4_FMec2NhhE2M65bX_KRe9hjxbd-wLLdtJIHx2L3pEr6cErxcg-_uatg11fLAQMOo7UxyOeHWuWbicQhOuJDsK3sAISH7fn9c5DS6knQJUNWP6eVMha_18a3LpLudzvIpqd1KhyxKlJhKturrhltGFFIYpwDJrZBlFLWRrgbYGhLGhnN5C3bG1jTZXBafD-Tdr14oGiqThVrvuLsksoH1uGlk3C8X_RLm1wrpWimBff5lW6u5OdWRgiPEiPcdR8hipkOSCrR-h2HUZp3Y9sJhauQpV0bYcGWPFkHaHeh5lpfqZ4-Ew0bGZZW17mkNxd3PT_JZN6w3nd2_TIUGRvv2LbKAPJxg6BS6TEpybrh2KQb-CXliJJiYtPe_fGncVGJEWEy7lhjwcmpHYPiPINvKZ8Y0_qFdUvbF_ebShxoyG3jzDKl9y2Dg3xDHUpe73AAKxwkRHvSlM-jiGAynEAEdUmXMxWjPLG2IGwiWgUGyHVFQfOA6Kn6Vm8C_bkgFaqXlCeeNoU4H24n6jPOZuQHyx-SxlSpxYFZU",
        p: "3nW-RJJ800GLt9GEpzE2hgBsT7XwTnWupR7yURcIhMnbagXcwEBIvVfiO34bpUS1Zpi14mVcXNdb1xg5HPW1DIm-chHWDMLHQP80RbA8dV_VH86eRuoVhGkW94V9oQ1YBPxDN1cFLDCiGteI4cvN0CK9S_cIojLbH2OUyvqOqwHZn4XUHm4PR4pwhWOBY9DJImyIqH5C6OM5hHAVniBAXbyhm3s_uRS9f5wTL1aARYRpVgM5kdrL8_6tRDk4PYcI-cEfU01ooAvjilmJFaxrRGR4n5YgJXg_UerWPh1Xg5c7wd1iV5f2d6K_UybEznAA0a7Ofnwe6I49s0GLyY5bZQ",
        q: "wCfWCl21BvsldeJ65RkEdJTGI0xKaVErbDSC_DA8i_bYHN4Y7IJfdeA_6iAjgFrOGfaOWwszfYj9t9MnEV23JlvcEZa89LUx4HVjOfFQM9LS_SSGEKCZSzQVXE_V8nZIifj72x20J3hi7iQqUjyR1QBgfMshrNnAM511PeCORUfTCRs1C42R8_5_mDamA-ZeeSvrAUvwyScS7-0TZr0XG2aZvAZz6uZEt7AKtVs6LfbrxqrUviy01SpAxj00GhAn3tgziV2yJPyMAQ4UcMqYzQbf_3ln6s7Gbtx51mH56oH973OBPHAkJanTqth4je1pCghx5Nq2su8oAaSOJwHmcQ",
        qi: "THccoHCaMe2UVUORSyX7lZa34PObEgkph9fKLrA2wlJO57f7Lz8Vo6y6FJ3fJ84VHsrmwZ6B1XpSNxkftKkKeIeLaQDt0SwnuXdd795TgJp5dTo4XRar1XKKisfnfCc6c2wCdtvLl65TPTdO0-TUfcbxidETJfEHMxWb9Ox0N9vTiL96yLIeh4rOMoOgBN0cHd-DlPSsbDX7SBV4ujS1E9Hsud3DN5pIdnFlqYZPK-GLpCZQXfUty6SdtKdLKklgre8IXI9kTArmxYE9rhXqnWoXImv3lVapuML_ISd447VdxRnpFyEaWpcqtZj8Nb-8HqY07AQUiKyn7PLmAhZCyw",
      }
  }
  
  try {
    return JSON.parse(keyData);
  } catch {
    throw new Error('Invalid Arweave key format in environment variables');
  }
};

/**
 * Upload a file to Arweave network
 * @param file - File to upload (image or JSON)
 * @param contentType - Optional content type override
 * @returns Promise with upload result
 */
export const uploadToArweave = async (
  file: File, 
  contentType?: string
): Promise<ArweaveUploadResponse> => {
  try {
    console.log('🔄 Starting Arweave upload...');

    // Validate file
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      };
    }

    // File type and size validation
    const isFileTypeSupported =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "application/json" ||
      contentType === "application/json";
    
    const isFileSizeSupported = file.size <= 5000 * 1024; // 5MB

    if (!isFileTypeSupported) {
      return {
        success: false,
        error: 'Unsupported file type. Only PNG, JPEG, and JSON files are supported.'
      };
    }

    if (!isFileSizeSupported) {
      return {
        success: false,
        error: 'File size too large. Maximum size is 5MB.'
      };
    }

    // Get file content as array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Create Arweave transaction
    const transaction = await arweave.createTransaction({
      data: arrayBuffer,
    });

    // Add content type tag
    transaction.addTag("Content-Type", contentType || file.type);
    
    // Add additional tags for better categorization
    transaction.addTag("App-Name", "PixelNFTGrid");
    transaction.addTag("File-Name", file.name);
    transaction.addTag("Upload-Time", new Date().toISOString());

    // Get signing key
    const arweaveKey = getArweaveKey();

    // Sign the transaction
    await arweave.transactions.sign(transaction, arweaveKey);

    console.log('📝 Transaction signed, posting to Arweave...');

    // Post transaction to Arweave
    const response = await arweave.transactions.post(transaction);

    if (response.status === 200) {
      const arweaveUrl = `https://arweave.net/${transaction.id}`;
      
      console.log(`✅ Upload successful! URL: ${arweaveUrl}`);
      
      return {
        success: true,
        url: arweaveUrl,
        txId: transaction.id,
        contentType: contentType || file.type
      };
    } else {
      console.error("❌ Arweave upload error:", response.status);
      return {
        success: false,
        error: `Arweave upload failed with status: ${response.status}`
      };
    }
  } catch (error) {
    console.error("❌ Upload API error:", error);
    return {
      success: false,
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Upload JSON metadata to Arweave
 * @param metadata - JSON metadata object
 * @returns Promise with upload result
 */
export const uploadMetadataToArweave = async (
  metadata: Record<string, unknown>
): Promise<ArweaveUploadResponse> => {
  try {
    // Convert metadata to JSON blob
    const jsonString = JSON.stringify(metadata, null, 2);
    const jsonBlob = new Blob([jsonString], { type: 'application/json' });
    const jsonFile = new File([jsonBlob], 'metadata.json', { type: 'application/json' });

    return await uploadToArweave(jsonFile, 'application/json');
  } catch (error) {
    console.error("❌ Metadata upload error:", error);
    return {
      success: false,
      error: 'Metadata upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Check Arweave transaction status
 * @param txId - Transaction ID to check
 * @returns Promise with transaction status
 */
export const checkArweaveStatus = async (txId: string): Promise<{
  success: boolean;
  confirmed?: boolean;
  blockHeight?: number;
  error?: string;
}> => {
  try {
    const status = await arweave.transactions.getStatus(txId);
    
    return {
      success: true,
      confirmed: status.confirmed !== null,
      blockHeight: status.confirmed?.block_height
    };
  } catch (error) {
    console.error("❌ Status check error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get the estimated cost for uploading data to Arweave
 * @param dataSize - Size of data in bytes
 * @returns Promise with cost estimation in AR tokens
 */
export const getArweaveUploadCost = async (dataSize: number): Promise<{
  success: boolean;
  cost?: string;
  error?: string;
}> => {
  try {
    const cost = await arweave.transactions.getPrice(dataSize);
    const costInAR = arweave.ar.winstonToAr(cost);
    
    return {
      success: true,
      cost: costInAR
    };
  } catch (error) {
    console.error("❌ Cost estimation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 