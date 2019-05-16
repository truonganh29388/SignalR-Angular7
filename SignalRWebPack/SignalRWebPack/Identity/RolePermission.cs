using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRWebPack.Identity
{
    public class RolePermission
    {
        public string Id { get; set; } 
        public string RoleId { get; set; }
        public SystemPermission SystemPermission { get; set; }
        public virtual Role Role { get; set; }
    }

    public enum SystemPermission
    {
        // Each enum must be [controller name + action name]
        [Description("View List Note")]
        ListNote = 1,
        [Description("Create Note")]
        CreateNote = 2,
        [Description("Update Note")]
        UpdateNote = 3,
        [Description("Get Note")]
        GetNote = 4,
        [Description("Delete Note")]
        DeleteNote = 5,

        [Description("View List App")]
        ListApp = 6,
        [Description("Create New App")]
        CreateApp = 7,
        [Description("Update App")]
        UpdateApp = 8,
        [Description("Get App")]
        GetApp = 9,
        [Description("Delete App")]
        DeleteApp = 10,
    }

}
