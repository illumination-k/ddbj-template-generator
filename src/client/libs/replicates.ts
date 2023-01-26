export function attachReplicateToSamplename(sample_name: string, replicateNumber: number) {
  return `${sample_name}-${replicateNumber}`;
}

export function attachReplicateToSampleTitle(sample_title: string, replicateNumber: number) {
  return `${sample_title} replicate-${replicateNumber}`;
}
