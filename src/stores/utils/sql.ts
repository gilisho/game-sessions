class TransactionBuilder {
  private readonly queries: string[] = [];
  private readonly params: any[][] = [];

  withQuery(sql: string, params: any[]) {
    this.queries.push(sql);
    this.params.push(params ?? []);
    return this;
  }

  toSql() {
    return {
      query: `START TRANSACTION;
${this.queries.join('\n')}
COMMIT;`,
      params: this.params.flat(),
    };
  }
}

export const aTransaction = () => new TransactionBuilder();
