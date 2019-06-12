/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
const openwhisk = require('openwhisk');


async function main(params) {
  const namespace = process.env.__OW_NAMESPACE;
  const { packageName } = params;
  const graySequence = `/${namespace}/${packageName}/grayandwrite`;
  const vrSequence = `/${namespace}/${packageName}/vrandwrite`;
  const ignoreCerts = false;
  const ow = openwhisk({ ignoreCerts });
  await Promise.all([
    ow.actions.invoke({
      actionName: graySequence,
      params: { bucket: params.bucket, url: params.body, key: params.key }
    }),
    ow.actions.invoke({
      actionName: vrSequence,
      params: { bucket: params.bucket, url: params.body, key: params.key }
    })]);

  return { message: 'Hello World' };
}
