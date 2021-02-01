import { CronJobData } from "../models/CronJobData";
import { PocketNetworkError } from "../models/Exceptions";
import BaseService from "./BaseService";
import PocketService from "./PocketService";

const COLLECTION_NAME = "CronJobData";

export default class CronJobService extends BaseService {
  constructor() {
    super();

    this.pocketService = new PocketService();
  }

  async getEntity() {
    const cronDB = await this.persistenceService.getEntities(COLLECTION_NAME);

    if (!cronDB.length) {
      const cronJobData = new CronJobData("", 0, [], [], []);
      const result = await this.persistenceService.saveEntity(
        COLLECTION_NAME,
        cronJobData
      );

      if (result.result.ok === 1) {
        cronJobData.id = result.insertedId;
        cronJobData.appStakeTransactions = [];
        cronJobData.pendingTransactions = [];
        cronJobData.nodeStakeTransactions = [];
        cronJobData.appUnstakeTransactions = [];
        cronJobData.nodeUnstakeTransactions = [];
        cronJobData.nodeUnjailTransactions = [];

        const updated = await this.update(cronJobData.id, cronJobData);

        if (updated) {
          return cronJobData;
        }
        throw new PocketNetworkError("CronJobData could not be updated!");
      }
    }

    return CronJobData.newInstance(cronDB);
  }

  async update(id, data) {
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      id,
      data
    );

    return result.result.ok === 1;
  }

  async addPendingTransaction(transaction) {
    const data = await this.getEntity();

    data.pendingTransactions.push(transaction);
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }

  async addAppStakeTransaction(transaction) {
    const data = await this.getEntity();

    data.appStakeTransactions.push(transaction);
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }

  async addNodeStakeTransaction(transaction) {
    const data = await this.getEntity();

    data.nodeStakeTransactions.push(transaction);
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }

  async addAppUnstakeTransaction(transaction) {
    const data = await this.getEntity();

    data.appUnstakeTransactions.push(transaction);
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }

  async addNodeUnstakeTransaction(transaction) {
    const data = await this.getEntity();

    data.nodeUnstakeTransactions.push(transaction);
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }

  async addNodeUnjailTransaction(transaction) {
    const data = await this.getEntity();

    data.nodeUnjailTransactions.push(transaction);
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }

  async removePendingTransaction(transaction) {
    const data = await this.getEntity();

    const newArray = data.pendingTransactions.filter(obj => {
      return obj.hash !== transaction.hash;
    });

    data.pendingTransactions = newArray;
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }

  async removeAppStakeTransaction(transaction) {
    const data = await this.getEntity();

    const newArray = data.appStakeTransactions.filter(obj => {
      return obj.hash !== transaction.hash;
    });

    data.appStakeTransactions = newArray;
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }

  async removeNodeStakeTransaction(transaction) {
    const data = await this.getEntity();

    const newArray = data.nodeStakeTransactions.filter(obj => {
      return obj.hash !== transaction.hash;
    });

    data.nodeStakeTransactions = newArray;
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }

  async removeAppUnstakeTransaction(transaction) {
    const data = await this.getEntity();

    const newArray = data.appUnstakeTransactions.filter(obj => {
      return obj.hash !== transaction.hash;
    });

    data.appUnstakeTransactions = newArray;
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }

  async removeNodeUnstakeTransaction(transaction) {
    const data = await this.getEntity();

    const newArray = data.nodeUnstakeTransactions.filter(obj => {
      return obj.hash !== transaction.hash;
    });

    data.nodeUnstakeTransactions = newArray;
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }

  async removeNodeUnjailTransaction(transaction) {
    const data = await this.getEntity();

    const newArray = data.nodeUnjailTransactions.filter(obj => {
      return obj.hash !== transaction.hash;
    });

    data.nodeUnjailTransactions = newArray;
    const result = await this.persistenceService.updateEntityByID(
      COLLECTION_NAME,
      data.id,
      data
    );

    return result.result.ok === 1;
  }
}
