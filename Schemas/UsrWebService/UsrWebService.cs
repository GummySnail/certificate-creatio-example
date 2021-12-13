namespace Terrasoft.Configuration
{
	using System;
	using System.Configuration;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	using Terrasoft.Common;
	using Terrasoft.Core;
	using Terrasoft.Core.DB;
	using Terrasoft.Web.Common;

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class UsrWebService : BaseService
	{
		[OperationContract]
		[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped,
			RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		public float GetLessonsDurationSum(string code)
        {
		
			float result = -1;
			if (string.IsNullOrEmpty(code))
				return result;
			var duration = "b511ed33-6de4-400f-a4df-9199bd3da236";
			var select = new Select(UserConnection)
				.Column(Func.Sum("UsrPoolClasses", "UsrLessonDuration")).As("SumDuration")
				.From("UsrPoolClasses")
				.Join(JoinType.Inner, "UsrSwimmingPrograms")
				.On("UsrPoolClasses", "UsrSwimmingProgramId").IsEqual("UsrSwimmingPrograms", "Id")
				.Where("UsrPoolClasses", "UsrLessonStatusDetailId").IsEqual(Column.Parameter(duration))
				.And("UsrSwimmingPrograms", "UsrCode").IsEqual(Column.Parameter(code)) as Select;
			if(select.ExecuteScalar<bool>())
            {
				result = select.ExecuteScalar<float>();
            }
			return result;

		}
	}
}