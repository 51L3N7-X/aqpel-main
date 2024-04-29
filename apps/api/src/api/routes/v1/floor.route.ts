import express from "express";
import { validate } from "../../middlewares/validate";
import {
  floorCreateValidate,
  floorDeleteValidate,
  floorGetValidate,
  floorModifyValidate,
  tableCreateValidate,
  tableDeleteValidate,
  tableGetValidate,
  tableModifyValidate,
} from "../../validations/public";
import {
  createFloor,
  deleteFloor,
  getFloors,
  getIndivFloor,
  modifyFloor,
} from "../../controllers/dashboard/floor.controller";
import { auth } from "../../middlewares/auth";
import { createTable } from "../../services/table.service";
import {
  addTable,
  deleteTable,
  getIndivTable,
  getTables,
  modifyTable,
} from "../../controllers/dashboard/table.controller";

const router = express.Router();

router.use(auth());

router
  .route("/")
  .post(validate(floorCreateValidate), createFloor)
  .get(getFloors);

router
  .route("/:floorId")
  .get(validate(floorGetValidate), getIndivFloor)
  .patch(validate(floorModifyValidate), modifyFloor)
  .delete(validate(floorDeleteValidate), deleteFloor);

// Table routes under a floor
router
  .route("/:floorId/table")
  .post(validate(tableCreateValidate), addTable)
  .get(getTables);

router
  .route("/:floorId/table/:tableId")
  .get(validate(tableGetValidate), getIndivTable)
  .patch(validate(tableModifyValidate), modifyTable)
  .delete(validate(tableDeleteValidate), deleteTable);

export { router };
