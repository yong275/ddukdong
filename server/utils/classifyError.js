// OpenAI/Solar API 에러를 4가지 코드로 분류
export function classifyApiError(err) {
  const status = err?.status ?? err?.response?.status;

  if (status === 401) {
    return { error_code: 'AUTH_INVALID_KEY', error_message: 'API 키가 유효하지 않습니다.' };
  }
  if (status === 429) {
    const msg = err?.message ?? '';
    if (msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('billing')) {
      return { error_code: 'AUTH_QUOTA_EXCEEDED', error_message: '할당량이 초과되었습니다.' };
    }
    return { error_code: 'SERVER_OVERLOAD', error_message: 'AI 서버가 혼잡합니다. 잠시 후 다시 시도해주세요.' };
  }
  if (status === 400) {
    const msg = err?.message ?? '';
    if (msg.toLowerCase().includes('content') || msg.toLowerCase().includes('policy') || msg.toLowerCase().includes('safety')) {
      return { error_code: 'CONTENT_POLICY', error_message: '콘텐츠 정책에 위반된 내용이 포함되어 있습니다.' };
    }
    return { error_code: 'CONTENT_INVALID', error_message: '입력 내용을 처리할 수 없습니다.' };
  }
  if (status === 503 || status === 502) {
    return { error_code: 'SERVER_OVERLOAD', error_message: 'AI 서버가 일시적으로 응답하지 않습니다.' };
  }
  if (err?.code === 'ECONNABORTED' || err?.code === 'ETIMEDOUT' || err?.message?.includes('timeout')) {
    return { error_code: 'SERVER_TIMEOUT', error_message: '응답 시간이 초과되었습니다.' };
  }
  if (err?.code === 'ENOTFOUND' || err?.code === 'ECONNREFUSED' || err?.code === 'ENETUNREACH') {
    return { error_code: 'NETWORK_OFFLINE', error_message: '네트워크에 연결할 수 없습니다.' };
  }

  return { error_code: 'UNKNOWN', error_message: err?.message ?? '알 수 없는 오류가 발생했습니다.' };
}
