

var pickerBirthdayOptions = {
					shortcuts: [
					{
						text: '今天',
						onClick(picker) {
						  const start = new Date();
						  picker.$emit('pick', [start, start]);
						}
					},
					{
						text: '昨天',
						onClick(picker) {
						  const date = new Date();
						  date.setTime(date.getTime() - 3600 * 1000 * 24);
						  picker.$emit('pick', [date, date]);
						}
					},
					{
						text: '近15天临产',
						onClick(picker) {
						  // 预产期为：今天到未来15天之内的用户
						  const end = new Date();
						  const start = new Date();
						  end.setTime(end.getTime() + 3600 * 1000 * 24 * 15);
						  picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '近7天满月',
						onClick(picker) {
						  const start = new Date();
						  const end = new Date();
						  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						  end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
						  picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '近7天满百天',
						onClick(picker) {
						  const start = new Date();
						  const end = new Date();
						  start.setTime(start.getTime() - 3600 * 1000 * 24 * 100);
						  end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
						  picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '近7天满周岁',
						onClick(picker) {
						  const start = new Date();
						  const end = new Date();
						  start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
						  end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
						  picker.$emit('pick', [start, end]);
						}
					}]
				}//end pickerOptions

				var pickerOptions = {
									shortcuts: [
									{
										text: '今天',
										onClick(picker) {
										  const start = new Date();
										  picker.$emit('pick', [start, start]);
										}
									},
									{
										text: '昨天',
										onClick(picker) {
										  const date = new Date();
										  date.setTime(date.getTime() - 3600 * 1000 * 24);
										  picker.$emit('pick', [date, date]);
										}
									},
									{
										text: '前天',
										onClick(picker) {
										  const date = new Date();
										  date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
										  picker.$emit('pick', [date, date]);
										}
									},
									{
										text: '最近一周',
										onClick(picker) {
										  const end = new Date();
										  const start = new Date();
										  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
										  picker.$emit('pick', [start, end]);
										}
									},
									{
										text: '最近一个月',
										onClick(picker) {
										  const end = new Date();
										  const start = new Date();
										  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
										  picker.$emit('pick', [start, end]);
										}
									},
									{
										text: '最近三个月',
										onClick(picker) {
										  const end = new Date();
										  const start = new Date();
										  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
										  picker.$emit('pick', [start, end]);
										}
									}]
								}//end pickerOptions

module.exports = {
                    pickerOptions:pickerOptions,
                    pickerBirthdayOptions:pickerBirthdayOptions
                }
