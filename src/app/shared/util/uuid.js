export function v4() {
    /** TODO temporal hack to generate a uuid v4 */
    let time = '' + new Date().getTime();
    return '2e049f3e-b8be-41c5-9608-' + time.substr(1);
}
