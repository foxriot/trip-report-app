export const ACTIONS = {
  SET_TITLE: "SET_TITLE",
  PROGRESS: "PROGRESS",
  STATISTICS_GET: "STATISTICS_GET",
  INSTANCE_GET: "INSTANCE_GET",
  INSTANCES_GET: "INSTANCES_GET",
  LOG: "LOG",
  DB_LOCK_REQUEST: "DB_LOCK_REQUEST",
  DB_LOCK_GIVEN: "DB_LOCK_GIVEN",
  DB_LOCK_RELEASE: "DB_LOCK_RELEASE",
  EXPORT_ASSET: "EXPORT_ASSET",
  ROTATE_IMAGE: "ROTATE_IMAGE",
  PREFERENCES_GET: "PREFERENCES_GET",
  PREFERENCES_SET: "PREFERENCES_SET",
  PREFERENCES_PATH: "PREFERENCES_PATH",
  BULK_IMPORT: "BULK_IMPORT",
  REQUEST_MANUAL_SCAN: "REQUEST_MANUAL_SCAN",
  INVOKE_MANUAL_SCAN: "INVOKE_MANUAL_SCAN",
  WATCHER_ONLINE: "WATCHER_ONLINE",
  WATCHER_OFFLINE: "WATCHER_OFFLINE",

  MEDIA_UPSERT: "MEDIA_UPSERT",
  MEDIA_GET: "MEDIA_GET",
  MEDIA_DELETE: "MEDIA_DELETE",

  SCREENSHOT_SET: "SCREENSHOT_SET",
  SCREENSHOT_GET: "SCREENSHOT_GET",
  SCREENSHOT_FAVORITE: "SCREENSHOT_FAVORITE",
  SCREENSHOT_ANNOTATE: "SCREENSHOT_ANNOTATE",

  USER_SET: "USER_SET",
  USER_GET: "USER_GET",

  WORLD_SET: "WORLD_SET",
  WORLD_GET: "WORLD_GET",
  WORLD_ANNOTATE: "WORLD_ANNOTATE"
};

export const ipcSend = (action, payload = {}) => {
  if (process.send) {
    process.send(JSON.stringify({ action, payload }));
  } else {
    console.log(`${action}:${payload}`);
  }
};

export const update = async (props) => {
  return upsert({ ...props, doInsert: false });
};
export const upsert = async ({
  knex,
  table,
  idField,
  id,
  data,
  doInsert = true
}) => {
  if (!knex) return;
  try {
    const existingRecord = await knex
      .select("*")
      .from(table)
      .modify((q) => {
        if (id) q.where(idField, "IN", Array.isArray(id) ? id : [id]);
      });
    if (existingRecord.length > 0) {
      const existingData = existingRecord[0];
      data = { ...existingData, ...data, ts: Date.now() };
      delete data.id;
      await knex(table)
        .update(data)
        .where({ [idField]: id })
        .catch((e) => {
          console.error(e);
        });
      return data;
    } else if (doInsert) {
      const newData = {
        ...data,
        ts: Date.now()
      };
      delete newData.id;
      let newId;
      await knex(table)
        .insert(newData)
        .then((id) => {
          newId = id;
        })
        .catch((e) => {
          console.error(e);
        });
      return newId ? { id: newId[0], ...newData } : null;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const read = async ({
  knex,
  table,
  idField,
  id,
  orderBy = "ts desc"
}) => {
  id = Array.isArray(id) ? id : [id];
  if (!knex) return;

  try {
    const data = await knex
      .select("*")
      .from(table)
      .modify((q) => {
        if (id) q.where(idField, "IN", id);
        if (orderBy.length > 0) q.orderByRaw(orderBy);
      });
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
export const destroy = async ({ knex, table, idField, id }) => {
  if (!knex) return;
  try {
    await knex(table).delete().whereIn(idField, [id]);
    return {};
  } catch (e) {
    console.error(e);
    return e;
  }
};

export default { ACTIONS, ipcSend };
