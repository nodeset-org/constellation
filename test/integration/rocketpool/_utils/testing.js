// Assert that a transaction reverts
export async function shouldRevert(txPromise, message, expectedErrorMessage = null) {
    let txSuccess = false;
    try {
        await txPromise;
        txSuccess = true;
    } catch (e) {
        // If we don't need to match a specific error message
        if (!expectedErrorMessage && e.message.indexOf('VM Exception') == -1) throw e;
        // If we do
        if (expectedErrorMessage && e.message.indexOf(expectedErrorMessage) == -1) assert.fail('Expected error message not found, error received: '+e.message.replace('Returned error:', ''));
    } finally {
        if (txSuccess) assert.fail(message);
    }
}
