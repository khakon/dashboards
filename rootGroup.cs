//------------------------------------------------------------------------------
// <auto-generated>
//     Этот код создан по шаблону.
//
//     Изменения, вносимые в этот файл вручную, могут привести к непредвиденной работе приложения.
//     Изменения, вносимые в этот файл вручную, будут перезаписаны при повторном создании кода.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Dashboards
{
    using System;
    using System.Collections.Generic;
    
    public partial class rootGroup
    {
        public rootGroup()
        {
            this.historySales = new HashSet<historySales>();
        }
    
        public int code_group_wares { get; set; }
        public int code_parent_group_wares { get; set; }
        public string name { get; set; }
        public int parent { get; set; }
        public int level { get; set; }
    
        public virtual ICollection<historySales> historySales { get; set; }
    }
}