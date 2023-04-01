import md5 from 'md5';
import { ZentaoApiResult } from './types';
import { formatDate } from './utils';
import Zentao from './zentao';

/**
 * 禅道 API 请求类
 *
 * @example
 * ```js
 * import {ZentaoApi} from 'zentao-api';
 * const zentao = new ZentaoApi({
 *     url: 'https://pro.demo.zentao.net/', account: 'demo', password: '123456'
 * });
 * // TODO: 使用 zentao 调用其他 API
 * ```
 */
export default class ZentaoApi extends Zentao {
  /**
   * 调用指定名称的 API
   * @param apiName API 名称
   * @param params 请求参数
   * @returns 调用结果
   * @example
   * ```js
   * import {ZentaoApi} from 'zentao-api';
   * const zentao = new ZentaoApi({
   *     url: 'https://pro.demo.zentao.net/', account: 'demo', password: '123456'
   * });
   *
   * const res = await zentao.call('getProductList', {status: 'noclosed'});
   * ```
   */
  call(
    apiName: Exclude<keyof ZentaoApi, 'call' | keyof Zentao>,
    params?: Record<string, any>
  ): Promise<ZentaoApiResult> {
    const func = this[apiName] as (params?: Record<string, any>) => Promise<ZentaoApiResult>;
    if (!func || typeof func !== 'function') {
      throw new Error(`Api method named "${apiName}" undefined.`);
    }
    return func.call(this, params);
  }

  getMyWorkTasks(params?: {}): Promise<ZentaoApiResult> {
    return this.module('my', 'work-task')
      .withParams([])
      .get();
  }


  getMyProjects(params?: {}): Promise<ZentaoApiResult> {
    return this.module('my', 'project')
      .withParams([])
      .get();
  }
}