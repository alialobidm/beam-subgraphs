import { 
    InitiatedValidatorRegistration,
    InitiatedValidatorRemoval,
    CompletedValidatorRegistration,
    CompletedValidatorRemoval,
    CompletedValidatorWeightUpdate,
    RegisteredInitialValidator,
} from '../generated/ValidatorManager/ValidatorManager'
import { 
    InitiatedDelegatorRegistration,
    InitiatedDelegatorRemoval,
    CompletedDelegatorRegistration,
    CompletedDelegatorRemoval,
    DelegatedNFTs,
    UptimeUpdated,
    RewardClaimed,
    RewardRegistered,
    RewardCancelled
} from '../generated/Native721TokenStakingManager/Native721TokenStakingManager'
import { 
    Validation,
    Delegation,
    UptimeUpdate,
    RegisteredRewards,
    ClaimedRewards
} from '../generated/schema'
import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts'


export function handleInitiatedValidatorRegistration(event: InitiatedValidatorRegistration): void {
    let entity = getOrCreateValidation(event.params.validationID)

    entity.nodeID = event.params.nodeID
    entity.owner = event.transaction.from
    entity.weight = event.params.weight
    entity.status = "PendingAdded"
    entity.initiateRegistrationTx = event.transaction.hash

    for(let i = 0; i < event.receipt!.logs.length; i++) {
        const eventLog = event.receipt!.logs[i]
        if(eventLog.topics[0].toHexString() == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
            let tokenIDs = entity.tokenIDs!
            tokenIDs.push(ethereum.decode("uint256", eventLog.topics[3])!.toBigInt())
            entity.tokenIDs = tokenIDs
        }
    }

    entity.totalTokens = BigInt.fromI32(entity.tokenIDs!.length)

    entity.save()
}

export function handleCompletedValidatorRegistration(event: CompletedValidatorRegistration): void {
    let entity = getOrCreateValidation(event.params.validationID)

    entity.startedAt = event.block.timestamp.toI64()
    entity.status = "Active"
    entity.completeRegistrationTx = event.transaction.hash
    entity.save()
}

export function handleRegisteredInitialValidator(event: RegisteredInitialValidator): void {
    let entity = getOrCreateValidation(event.params.validationID)

    entity.nodeID = event.params.nodeID
    entity.owner = Address.zero()
    entity.weight = event.params.weight
    entity.startedAt = event.block.timestamp.toI64()
    entity.status = "Active"
    entity.save()
}


export function handleInitiatedValidatorRemoval(event: InitiatedValidatorRemoval): void {
    let entity = getOrCreateValidation(event.params.validationID)

    entity.endTime = event.params.endTime.toI64()
    entity.status = "PendingRemoved"
    entity.save()
}

export function handleCompletedValidatorRemoval(event: CompletedValidatorRemoval): void {
    let entity = getOrCreateValidation(event.params.validationID)

    entity.status = "Removed"
    entity.save()
}

export function handleCompletedValidatorWeightUpdate(event: CompletedValidatorWeightUpdate): void {
    let entity = getOrCreateValidation(event.params.validationID)

    entity.weight = event.params.weight
    entity.save() 
}

export function handleInitiatedDelegatorRegistration(event: InitiatedDelegatorRegistration): void {
    let entity = getOrCreateDelegation(event.params.delegationID)
    let validation = getOrCreateValidation(event.params.validationID)

    entity.validationID = validation.id
    entity.validationNodeID = validation.nodeID
    entity.owner = event.params.delegatorAddress
    entity.weight = event.params.delegatorWeight
    entity.status = "PendingAdded"
    entity.initiateRegistrationTx = event.transaction.hash
    entity.save()
}

export function handleCompletedDelegatorRegistration(event: CompletedDelegatorRegistration): void {
    let entity = getOrCreateDelegation(event.params.delegationID)

    entity.startedAt = event.params.startTime.toI64()
    entity.status = "Active"
    entity.completeRegistrationTx = event.transaction.hash
    entity.save()
}

export function handleInitiatedDelegatorRemoval(event: InitiatedDelegatorRemoval): void {
    let entity = getOrCreateDelegation(event.params.delegationID)

    entity.endTime = event.block.timestamp.toI64()
    entity.status = "PendingRemoved"
    entity.save()

    if(entity.tokenIDs != null){
        let validation = getOrCreateValidation(entity.validationID)
        validation.totalTokens = validation.totalTokens.minus(BigInt.fromI32(entity.tokenIDs!.length)) 
        validation.save()
    }
}

export function handleCompletedDelegatorRemoval(event: CompletedDelegatorRemoval): void {
    let entity = getOrCreateDelegation(event.params.delegationID)

    entity.status = "Removed"
    entity.save()
}

export function handleDelegatedNFTs(event: DelegatedNFTs): void {
    let entity = getOrCreateDelegation(event.params.delegationID)

    entity.tokenIDs = event.params.tokenIDs
    entity.save()

    let validation = getOrCreateValidation(entity.validationID)
    validation.totalTokens = validation.totalTokens.plus(BigInt.fromI32(event.params.tokenIDs.length))
    validation.save()
}

export function handleUptimeUpdated(event: UptimeUpdated): void {
    let entity = UptimeUpdate.load(event.params.validationID.concatI32(event.params.epoch.toI32()))
    if (entity == null) {
        entity = new UptimeUpdate(event.params.validationID.concatI32(event.params.epoch.toI32()))
    }

    entity.validationID = event.params.validationID
    entity.uptimeSeconds = event.params.uptime
    entity.epoch = event.params.epoch
    entity.save()
}


export function handleRewardClaimed(event: RewardClaimed): void {
    let entity = getOrCreateClaimedRewads(
        event.params.account
        .concatI32(event.params.epoch.toI32())
        .concatI32(event.params.primary ? 1 : 0)
    )

    entity.epoch = event.params.epoch
    entity.primary = event.params.primary
    entity.account = event.params.account

    var present = false
    for(var i=0; i<entity.tokens!.length; i++){
        if(entity.tokens![i] == event.params.token){
            entity.amounts![i] = entity.amounts![i].plus(event.params.amount)
            present = true
            break
        }
    }

    if(!present){
        entity.tokens!.push(event.params.token)
        entity.amounts!.push(event.params.amount)
    }

    entity.save()
}

export function handleRewardRegistered(event: RewardRegistered): void {
    let entity = getOrCreateRegisteredRewads(
        Bytes.empty()
        .concatI32(event.params.epoch.toI32())
        .concatI32(event.params.primary ? 1 : 0)
    )

    entity.epoch = event.params.epoch
    entity.primary = event.params.primary

    var present = false
    for(var i=0; i<entity.tokens!.length; i++){
        if(entity.tokens![i] == event.params.token){
            entity.amounts![i] = entity.amounts![i].plus(event.params.amount)
            present = true
            break
        }
    }

    if(!present){
        entity.tokens!.push(event.params.token)
        entity.amounts!.push(event.params.amount)
    }

    entity.save()
}

export function handleRewardCancelled(event: RewardCancelled): void {
    let entity = getOrCreateRegisteredRewads(
        Bytes.empty()
        .concatI32(event.params.epoch.toI32())
        .concatI32(event.params.primary ? 1 : 0)
    )

    entity.epoch = event.params.epoch
    entity.primary = event.params.primary

    for(var i=0; i<entity.tokens!.length; i++){
        if(entity.tokens![i] == event.params.token){
            entity.amounts![i] = BigInt.zero()
            break
        }
    }

    entity.save()
}

// helper funcfions
function getOrCreateValidation(id: Bytes): Validation {
    let entity = Validation.load(id)
    if (entity == null) {
        entity = new Validation(id)
        entity.nodeID = Bytes.empty()
        entity.weight = BigInt.zero()
        entity.status = "Unknown"
        entity.tokenIDs = []
        entity.totalTokens = BigInt.zero()
    }
    return entity;
}

function getOrCreateDelegation(id: Bytes): Delegation {
    let entity = Delegation.load(id)
    if (entity == null) {
        entity = new Delegation(id)
        entity.validationID = Bytes.empty()
        entity.validationNodeID = Bytes.empty()
        entity.owner = Bytes.empty()
        entity.weight = BigInt.zero()
        entity.status = "Unknown"
    }
    return entity;
}

function getOrCreateClaimedRewads(id: Bytes): ClaimedRewards {
    let entity = ClaimedRewards.load(id)
    if (entity == null) {
        entity = new ClaimedRewards(id)
        entity.epoch = BigInt.zero()
        entity.primary = true
        entity.account = Bytes.empty()
        entity.tokens = []
        entity.amounts = []
    }
    return entity;
}

function getOrCreateRegisteredRewads(id: Bytes): RegisteredRewards {
    let entity = RegisteredRewards.load(id)
    if (entity == null) {
        entity = new RegisteredRewards(id)
        entity.epoch = BigInt.zero()
        entity.primary = true
        entity.tokens = []
        entity.amounts = []
    }
    return entity;
}
