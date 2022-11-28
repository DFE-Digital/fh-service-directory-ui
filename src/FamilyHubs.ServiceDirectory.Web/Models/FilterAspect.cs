﻿using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Models;

[DebuggerDisplay("{Id}")]
public record FilterAspect(string Id, string Description, bool Selected = false) : IFilterAspect;
