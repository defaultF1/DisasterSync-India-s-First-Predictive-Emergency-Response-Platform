/**
 * Enhanced Local Blockchain Service
 * Features:
 * - Real SHA-256 hashing using Node.js crypto
 * - Merkle-style chaining (each block links to previous)
 * - File persistence (blockchain.json)
 * - Tamper detection
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const BLOCKCHAIN_FILE = path.join(__dirname, 'blockchain.json');

// In-memory chain
let chain = [];

/**
 * Calculate SHA-256 hash of a block's contents
 */
function calculateHash(block) {
    const data = JSON.stringify({
        id: block.id,
        type: block.type,
        data: block.data,
        timestamp: block.timestamp,
        previousHash: block.previousHash
    });
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Load blockchain from file on startup
 */
function loadChain() {
    try {
        if (fs.existsSync(BLOCKCHAIN_FILE)) {
            const data = fs.readFileSync(BLOCKCHAIN_FILE, 'utf8');
            chain = JSON.parse(data);
            console.log(`⛓️  Blockchain loaded: ${chain.length} blocks`);
        } else {
            // Create genesis block
            const genesis = createGenesisBlock();
            chain = [genesis];
            saveChain();
            console.log('⛓️  Genesis block created');
        }
    } catch (error) {
        console.error('Failed to load blockchain:', error.message);
        chain = [createGenesisBlock()];
    }
}

/**
 * Save blockchain to file
 */
function saveChain() {
    try {
        fs.writeFileSync(BLOCKCHAIN_FILE, JSON.stringify(chain, null, 2));
    } catch (error) {
        console.error('Failed to save blockchain:', error.message);
    }
}

/**
 * Create the first block (Genesis Block)
 */
function createGenesisBlock() {
    const block = {
        id: 'genesis',
        index: 0,
        type: 'GENESIS',
        data: { message: 'DisasterSync Blockchain Initialized' },
        timestamp: new Date().toISOString(),
        previousHash: '0'.repeat(64),
        hash: ''
    };
    block.hash = calculateHash(block);
    return block;
}

/**
 * Add a new block to the chain
 */
function addBlock(type, data) {
    const previousBlock = chain[chain.length - 1];

    const newBlock = {
        id: uuidv4(),
        index: chain.length,
        type,
        data,
        timestamp: new Date().toISOString(),
        previousHash: previousBlock.hash,
        hash: ''
    };

    newBlock.hash = calculateHash(newBlock);
    chain.push(newBlock);
    saveChain();

    console.log(`⛓️  Block #${newBlock.index} added: ${type}`);
    return newBlock;
}

/**
 * Get the entire blockchain
 */
function getChain() {
    return chain;
}

/**
 * Get the latest block
 */
function getLatestBlock() {
    return chain[chain.length - 1];
}

/**
 * Verify the integrity of the entire chain
 * Returns { valid: boolean, error?: string, invalidBlock?: number }
 */
function verifyChain() {
    for (let i = 1; i < chain.length; i++) {
        const currentBlock = chain[i];
        const previousBlock = chain[i - 1];

        // Check if current block's hash is correct
        const recalculatedHash = calculateHash(currentBlock);
        if (currentBlock.hash !== recalculatedHash) {
            return {
                valid: false,
                error: `Block #${i} hash mismatch. Data has been tampered!`,
                invalidBlock: i
            };
        }

        // Check if previous hash reference is correct
        if (currentBlock.previousHash !== previousBlock.hash) {
            return {
                valid: false,
                error: `Block #${i} previous hash mismatch. Chain is broken!`,
                invalidBlock: i
            };
        }
    }

    return { valid: true, message: 'Blockchain integrity verified. No tampering detected.' };
}

/**
 * Get blockchain statistics
 */
function getStats() {
    const typeCount = {};
    chain.forEach(block => {
        typeCount[block.type] = (typeCount[block.type] || 0) + 1;
    });

    return {
        totalBlocks: chain.length,
        latestBlock: chain[chain.length - 1]?.hash?.substring(0, 16) + '...',
        blocksByType: typeCount,
        genesisTime: chain[0]?.timestamp,
        lastActivity: chain[chain.length - 1]?.timestamp
    };
}

// Load chain on module import
loadChain();

module.exports = {
    addBlock,
    getChain,
    getLatestBlock,
    verifyChain,
    getStats,
    calculateHash
};
